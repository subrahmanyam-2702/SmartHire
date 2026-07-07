const asyncHandler = require('express-async-handler');
const CandidateProfile = require('../models/CandidateProfile');
const { getEmbedding } = require('../services/embedding.service');
const { checkAndIncrementCandidateAiCall } = require('../services/quota.service');
const { success, failure } = require('../utils/apiResponse');

/**
 * @route GET /api/candidate/profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const profile = await CandidateProfile.findOne({ user: req.user._id });
  if (!profile) return failure(res, 404, 'Profile not found');
  return success(res, 200, 'Profile fetched', profile);
});

/**
 * @route PUT /api/candidate/profile
 * body: { fullName, careerGoal, yearsOfExperience, skills: string[] }
 * Matches reference app's "Profile Details" form (Save Profile button).
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, careerGoal, yearsOfExperience, skills } = req.body;

  const profile = await CandidateProfile.findOneAndUpdate(
    { user: req.user._id },
    {
      ...(fullName !== undefined && { fullName }),
      ...(careerGoal !== undefined && { careerGoal }),
      ...(yearsOfExperience !== undefined && { yearsOfExperience }),
      ...(skills !== undefined && { skills }),
    },
    { new: true, upsert: true }
  );

  return success(res, 200, 'Profile saved', profile);
});

/**
 * @route POST /api/candidate/profile/regenerate-embedding
 * Matches reference app's "Regenerate Embedding" button — recomputes the
 * candidate's semantic search vector from their current skills/career goal
 * after a manual edit (without needing to re-upload a resume).
 */
const regenerateEmbedding = asyncHandler(async (req, res) => {
  const profile = await CandidateProfile.findOne({ user: req.user._id });
  if (!profile) return failure(res, 404, 'Profile not found');

  if (!profile.skills.length && !profile.careerGoal) {
    return failure(res, 400, 'Add some skills or a career goal before regenerating your embedding');
  }

  await checkAndIncrementCandidateAiCall(profile._id);

  const text = [profile.careerGoal, profile.skills.join(', ')].filter(Boolean).join('. ');
  const embedding = await getEmbedding(text);

  profile.embedding = embedding;
  profile.embeddingUpdatedAt = new Date();
  await profile.save();

  return success(res, 200, 'Embedding regenerated — you are now searchable by recruiters', {
    embeddingUpdatedAt: profile.embeddingUpdatedAt,
  });
});

module.exports = { getProfile, updateProfile, regenerateEmbedding };
