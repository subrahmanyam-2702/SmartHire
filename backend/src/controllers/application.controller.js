const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const CandidateProfile = require('../models/CandidateProfile');
const Notification = require('../models/Notification');
const { cosineSimilarity, toMatchPercentage } = require('../utils/cosineSimilarity');
const {
  generateMatchExplanation,
  generateCoverLetter,
} = require('../services/llm.service');
const {
  checkAndIncrementCandidateAiCall,
  checkAndIncrementOrgAiCall,
} = require('../services/quota.service');
const { success, failure } = require('../utils/apiResponse');

/**
 * @route POST /api/applications  (candidate)
 * body: { jobId }
 * Powers moving a job from "Matches" into the "Applications (n)" tab.
 */
const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  const job = await Job.findById(jobId);
  if (!job) return failure(res, 404, 'Job not found');

  const existing = await Application.findOne({ candidate: req.user._id, job: jobId });
  if (existing) return failure(res, 400, 'You already applied to this job');

  const profile = await CandidateProfile.findOne({ user: req.user._id });
  const resume = await Resume.findOne({ candidate: req.user._id }).sort({ createdAt: -1 });

  const matchScore = profile?.embedding?.length
    ? toMatchPercentage(cosineSimilarity(profile.embedding, job.embedding))
    : 0;

  let aiExplanation = '';
  if (resume) {
    try {
      await checkAndIncrementCandidateAiCall(profile._id);
      aiExplanation = await generateMatchExplanation(resume.rawText, job.description, matchScore);
    } catch {
      aiExplanation = '';
    }
  }

  const application = await Application.create({
    candidate: req.user._id,
    job: jobId,
    resume: resume?._id,
    matchScore,
    aiExplanation,
  });

  await Notification.create({
    user: job.postedBy,
    type: 'new_match',
    message: `New application for "${job.title}" (${matchScore}% match)`,
    link: `/recruiter/jobs/${job._id}/applications`,
  });

  return success(res, 201, 'Application submitted', application);
});

/**
 * @route GET /api/applications/candidate
 * Powers Dashboard "Applications (n)" tab.
 */
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate('job', 'title companyName location category')
    .sort({ createdAt: -1 });
  return success(res, 200, 'Applications fetched', applications);
});

/**
 * @route GET /api/applications/candidate/interviews
 * Powers Dashboard "Interviews (n)" tab.
 */
const getMyInterviews = asyncHandler(async (req, res) => {
  const interviews = await Application.find({
    candidate: req.user._id,
    status: { $in: ['interview_scheduled', 'interviewed'] },
  })
    .populate('job', 'title companyName location')
    .sort({ 'interview.date': 1 });
  return success(res, 200, 'Interviews fetched', interviews);
});

/**
 * @route GET /api/applications/job/:jobId (recruiter — pipeline view)
 */
const getApplicationsForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return failure(res, 404, 'Job not found');
  if (String(job.organization) !== String(req.user.organization)) {
    return failure(res, 403, 'Not authorized');
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate('candidate', 'name email')
    .sort({ matchScore: -1 });
  return success(res, 200, 'Applications fetched', applications);
});

/**
 * @route PUT /api/applications/:id/status (recruiter)
 * body: { status, interviewDate?, meetingLink?, notes? }
 */
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, interviewDate, meetingLink, notes } = req.body;
  const application = await Application.findById(req.params.id).populate('job');
  if (!application) return failure(res, 404, 'Application not found');
  if (String(application.job.organization) !== String(req.user.organization)) {
    return failure(res, 403, 'Not authorized');
  }

  application.status = status || application.status;
  if (status === 'interview_scheduled') {
    application.interview = {
      date: interviewDate,
      meetingLink,
      notes,
    };
  }
  await application.save();

  await Notification.create({
    user: application.candidate,
    type: status === 'interview_scheduled' ? 'interview_scheduled' : 'status_change',
    message:
      status === 'interview_scheduled'
        ? `Interview scheduled for "${application.job.title}"`
        : `Your application status changed to "${status}" for "${application.job.title}"`,
    link: '/candidate',
  });

  return success(res, 200, 'Application updated', application);
});

/**
 * @route POST /api/applications/:id/cover-letter (candidate)
 */
const generateCoverLetterForApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('job')
    .populate('resume');
  if (!application) return failure(res, 404, 'Application not found');
  if (String(application.candidate) !== String(req.user._id)) {
    return failure(res, 403, 'Not authorized');
  }
  if (!application.resume) return failure(res, 400, 'No resume attached to this application');

  const profile = await CandidateProfile.findOne({ user: req.user._id });
  try {
    await checkAndIncrementCandidateAiCall(profile._id);
  } catch (err) {
    return failure(res, 429, err.message);
  }

  const letter = await generateCoverLetter(
    application.resume.rawText,
    application.job.description,
    profile.fullName || req.user.name
  );

  application.coverLetter = letter;
  await application.save();

  return success(res, 200, 'Cover letter generated', { coverLetter: letter });
});

module.exports = {
  applyToJob,
  getMyApplications,
  getMyInterviews,
  getApplicationsForJob,
  updateApplicationStatus,
  generateCoverLetterForApplication,
};
