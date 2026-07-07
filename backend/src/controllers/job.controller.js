const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const { getEmbedding } = require('../services/embedding.service');
const { checkAndIncrementOrgJobPost } = require('../services/quota.service');
const { success, failure } = require('../utils/apiResponse');

/**
 * @route POST /api/jobs   (recruiter only)
 */
const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    companyName,
    category,
    description,
    requirements = [],
    location,
    employmentType,
    salaryRange,
  } = req.body;

  if (!title || !companyName || !description) {
    return failure(res, 400, 'title, companyName and description are required');
  }
  if (!req.user.organization) {
    return failure(res, 400, 'Recruiter must belong to an organization');
  }

  try {
    await checkAndIncrementOrgJobPost(req.user.organization);
  } catch (err) {
    return failure(res, 429, err.message);
  }

  const embeddingText = [title, description, requirements.join(', ')].filter(Boolean).join('. ');
  const embedding = await getEmbedding(embeddingText);

  const job = await Job.create({
    organization: req.user.organization,
    postedBy: req.user._id,
    title,
    companyName,
    category,
    description,
    requirements,
    location,
    employmentType,
    salaryRange,
    embedding,
  });

  return success(res, 201, 'Job posted successfully', job);
});

/**
 * @route GET /api/jobs (public/candidate browse, with optional filters)
 */
const getJobs = asyncHandler(async (req, res) => {
  const { q, location, category } = req.query;
  const filter = { status: 'open' };
  if (location) filter.location = new RegExp(location, 'i');
  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };

  const jobs = await Job.find(filter).select('-embedding').sort({ createdAt: -1 }).limit(100);
  return success(res, 200, 'Jobs fetched', jobs);
});

/**
 * @route GET /api/jobs/mine (recruiter's own jobs)
 */
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ organization: req.user.organization })
    .select('-embedding')
    .sort({ createdAt: -1 });
  return success(res, 200, 'Your jobs fetched', jobs);
});

/**
 * @route GET /api/jobs/:id
 */
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).select('-embedding');
  if (!job) return failure(res, 404, 'Job not found');
  return success(res, 200, 'Job fetched', job);
});

/**
 * @route PUT /api/jobs/:id (recruiter only, own org)
 */
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return failure(res, 404, 'Job not found');
  if (String(job.organization) !== String(req.user.organization)) {
    return failure(res, 403, 'Not authorized to edit this job');
  }

  const fields = ['title', 'companyName', 'category', 'description', 'requirements', 'location', 'employmentType', 'salaryRange', 'status'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) job[f] = req.body[f];
  });

  if (req.body.title || req.body.description || req.body.requirements) {
    const embeddingText = [job.title, job.description, job.requirements.join(', ')].join('. ');
    job.embedding = await getEmbedding(embeddingText);
  }

  await job.save();
  return success(res, 200, 'Job updated', job);
});

/**
 * @route DELETE /api/jobs/:id (recruiter only, own org)
 */
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return failure(res, 404, 'Job not found');
  if (String(job.organization) !== String(req.user.organization)) {
    return failure(res, 403, 'Not authorized to delete this job');
  }
  await job.deleteOne();
  return success(res, 200, 'Job deleted');
});

module.exports = { createJob, getJobs, getMyJobs, getJobById, updateJob, deleteJob };
