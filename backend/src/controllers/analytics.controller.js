const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { success } = require('../utils/apiResponse');

/**
 * @route GET /api/analytics/recruiter
 * Funnel: applied -> shortlisted -> interview_scheduled -> interviewed -> hired
 */
const getRecruiterAnalytics = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ organization: req.user.organization }).select('_id');
  const jobIds = jobs.map((j) => j._id);

  const applications = await Application.find({ job: { $in: jobIds } });

  const funnel = {
    applied: 0,
    shortlisted: 0,
    interview_scheduled: 0,
    interviewed: 0,
    offered: 0,
    hired: 0,
    rejected: 0,
  };
  let totalScore = 0;

  applications.forEach((app) => {
    funnel[app.status] = (funnel[app.status] || 0) + 1;
    totalScore += app.matchScore || 0;
  });

  const avgMatchScore = applications.length
    ? Math.round(totalScore / applications.length)
    : 0;

  return success(res, 200, 'Analytics fetched', {
    totalJobs: jobs.length,
    totalApplications: applications.length,
    avgMatchScore,
    funnel,
  });
});

module.exports = { getRecruiterAnalytics };
