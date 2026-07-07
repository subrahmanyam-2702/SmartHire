const asyncHandler = require('express-async-handler');
const Resume = require('../models/Resume');
const CandidateProfile = require('../models/CandidateProfile');
const { generateResumeFeedback, generateCareerGrowthPlan } = require('../services/llm.service');
const { checkAndIncrementCandidateAiCall } = require('../services/quota.service');
const { success, failure } = require('../utils/apiResponse');

/**
 * @route POST /api/career-tools/resume-feedback
 * Matches reference app: Career Tools -> "Resume Feedback" tab -> "Analyze My Resume".
 */
const analyzeResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ candidate: req.user._id }).sort({ createdAt: -1 });
  if (!resume) return failure(res, 404, 'Upload a resume first');

  const profile = await CandidateProfile.findOne({ user: req.user._id });
  try {
    await checkAndIncrementCandidateAiCall(profile._id);
  } catch (err) {
    return failure(res, 429, err.message);
  }

  const feedback = await generateResumeFeedback(resume.rawText);

  resume.atsScore = feedback.atsScore;
  resume.feedback = {
    summary: feedback.summary,
    strengths: feedback.strengths,
    improvements: feedback.improvements,
    generatedAt: new Date(),
  };
  await resume.save();

  return success(res, 200, 'Resume analyzed', resume.feedback && { ...feedback });
});

/**
 * @route POST /api/career-tools/growth-plan
 * Matches reference app: Career Tools -> "Career Growth Plan" tab.
 */
const getCareerGrowthPlan = asyncHandler(async (req, res) => {
  const profile = await CandidateProfile.findOne({ user: req.user._id });
  if (!profile) return failure(res, 404, 'Profile not found');
  if (!profile.careerGoal) {
    return failure(res, 400, 'Set a career goal on your profile first');
  }

  try {
    await checkAndIncrementCandidateAiCall(profile._id);
  } catch (err) {
    return failure(res, 429, err.message);
  }

  const plan = await generateCareerGrowthPlan({
    careerGoal: profile.careerGoal,
    skills: profile.skills,
    yearsOfExperience: profile.yearsOfExperience,
  });

  return success(res, 200, 'Career growth plan generated', plan);
});

module.exports = { analyzeResume, getCareerGrowthPlan };
