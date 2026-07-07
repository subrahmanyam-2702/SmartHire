const asyncHandler = require('express-async-handler');
const Resume = require('../models/Resume');
const CandidateProfile = require('../models/CandidateProfile');
const { parseResumePdf } = require('../services/resumeParser.service');
const { getEmbedding } = require('../services/embedding.service');
const { extractResumeData } = require('../services/llm.service');
const { uploadPdfBuffer } = require('../services/upload.service');
const {
  checkAndIncrementCandidateResumeUpload,
  checkAndIncrementCandidateAiCall,
} = require('../services/quota.service');
const { success, failure } = require('../utils/apiResponse');

/**
 * @route POST /api/resumes/upload
 * multipart/form-data, field name "resume", PDF only, max 5MB.
 *
 * Flow (matches reference app's Profile page copy: "AI will auto-extract
 * your skills, experience, and career goal — no manual entry needed"):
 *   1. Extract raw text from PDF
 *   2. Groq structures it into skills/experience/careerGoal
 *   3. Hugging Face embeds it for semantic matching
 *   4. Candidate profile is auto-filled
 */
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) return failure(res, 400, 'No resume file uploaded');

  const profile = await CandidateProfile.findOne({ user: req.user._id });
  if (!profile) return failure(res, 404, 'Candidate profile not found');

  try {
    await checkAndIncrementCandidateResumeUpload(profile._id);
  } catch (err) {
    return failure(res, 429, err.message);
  }

  const rawText = await parseResumePdf(req.file.buffer);
  if (!rawText || rawText.length < 30) {
    return failure(res, 400, 'Could not extract readable text from this PDF');
  }

  const uploadResult = await uploadPdfBuffer(req.file.buffer, req.file.originalname);

  await checkAndIncrementCandidateAiCall(profile._id);
  const extracted = await extractResumeData(rawText);

  const embedding = await getEmbedding(
    [extracted.careerGoal, (extracted.skills || []).join(', '), rawText.slice(0, 1000)]
      .filter(Boolean)
      .join('. ')
  );

  const resume = await Resume.create({
    candidate: req.user._id,
    fileUrl: uploadResult.secure_url,
    fileName: req.file.originalname,
    rawText,
    aiExtracted: extracted,
  });

  // Auto-fill profile per reference app behavior — "no manual entry needed"
  profile.fullName = profile.fullName || req.user.name;
  profile.careerGoal = extracted.careerGoal || profile.careerGoal;
  profile.yearsOfExperience = extracted.yearsOfExperience ?? profile.yearsOfExperience;
  profile.skills = Array.from(new Set([...(profile.skills || []), ...(extracted.skills || [])]));
  profile.embedding = embedding;
  profile.embeddingUpdatedAt = new Date();
  await profile.save();

  return success(res, 201, 'Resume uploaded and profile auto-filled', { resume, profile });
});

/**
 * @route GET /api/resumes
 */
const getMyResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ candidate: req.user._id }).sort({ createdAt: -1 });
  return success(res, 200, 'Resumes fetched', resumes);
});

/**
 * @route GET /api/resumes/latest
 */
const getLatestResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ candidate: req.user._id }).sort({ createdAt: -1 });
  if (!resume) return failure(res, 404, 'No resume uploaded yet');
  return success(res, 200, 'Latest resume fetched', resume);
});

module.exports = { uploadResume, getMyResumes, getLatestResume };
