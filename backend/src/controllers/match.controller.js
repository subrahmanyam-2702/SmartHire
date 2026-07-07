const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const CandidateProfile = require('../models/CandidateProfile');
const Application = require('../models/Application');
const { rankJobsForCandidate, rankCandidatesForJob } = require('../services/matching.service');
const { generateSkillGapSummary } = require('../services/llm.service');
const { success, failure } = require('../utils/apiResponse');

/**
 * @route GET /api/matches/candidate
 * Powers the candidate Dashboard "Matches (n)" tab.
 */
const getMatchesForCandidate = asyncHandler(async (req, res) => {
  const profile = await CandidateProfile.findOne({ user: req.user._id });
  if (!profile || !profile.embedding?.length) {
    return failure(res, 400, 'Upload a resume or regenerate your embedding first');
  }

  const jobs = await Job.find({ status: 'open' });
  const ranked = rankJobsForCandidate(profile.embedding, jobs);

  const applied = await Application.find({ candidate: req.user._id }).select('job');
  const appliedJobIds = new Set(applied.map((a) => String(a.job)));

  const results = ranked.slice(0, 30).map(({ job, matchScore }) => ({
    _id: job._id,
    title: job.title,
    companyName: job.companyName,
    category: job.category,
    description: job.description,
    requirements: job.requirements,
    location: job.location,
    matchScore,
    alreadyApplied: appliedJobIds.has(String(job._id)),
  }));

  return success(res, 200, 'Matches fetched', results);
});

/**
 * @route GET /api/matches/candidate/:jobId/skill-gap
 */
const getSkillGapForJob = asyncHandler(async (req, res) => {
  const profile = await CandidateProfile.findOne({ user: req.user._id });
  const job = await Job.findById(req.params.jobId);
  if (!profile || !job) return failure(res, 404, 'Profile or job not found');

  const gap = await generateSkillGapSummary(profile.skills || [], job.requirements || []);
  return success(res, 200, 'Skill gap analysis', gap);
});

/**
 * @route GET /api/matches/job/:jobId (recruiter — ranked candidates for a job)
 */
const getCandidatesForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return failure(res, 404, 'Job not found');
  if (String(job.organization) !== String(req.user.organization)) {
    return failure(res, 403, 'Not authorized to view matches for this job');
  }

  const profiles = await CandidateProfile.find({ 'embedding.0': { $exists: true } }).populate(
    'user',
    'name email'
  );
  const ranked = rankCandidatesForJob(job.embedding, profiles);

  const results = ranked.slice(0, 30).map(({ profile, matchScore }) => ({
    candidateId: profile.user._id,
    name: profile.fullName || profile.user.name,
    email: profile.user.email,
    careerGoal: profile.careerGoal,
    skills: profile.skills,
    yearsOfExperience: profile.yearsOfExperience,
    matchScore,
  }));

  return success(res, 200, 'Candidate matches fetched', results);
});

module.exports = { getMatchesForCandidate, getSkillGapForJob, getCandidatesForJob };
