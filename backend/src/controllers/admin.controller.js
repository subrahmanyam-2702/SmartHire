const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { success, failure } = require('../utils/apiResponse');

const getPlatformStats = asyncHandler(async (req, res) => {
  const [userCount, orgCount, jobCount, applicationCount] = await Promise.all([
    User.countDocuments(),
    Organization.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
  ]);
  return success(res, 200, 'Platform stats', { userCount, orgCount, jobCount, applicationCount });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return success(res, 200, 'Users fetched', users);
});

const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) return failure(res, 404, 'User not found');
  return success(res, 200, 'User deactivated', user);
});

const getAllOrganizations = asyncHandler(async (req, res) => {
  const orgs = await Organization.find().populate('owner', 'name email').sort({ createdAt: -1 });
  return success(res, 200, 'Organizations fetched', orgs);
});

const updateOrganizationPlan = asyncHandler(async (req, res) => {
  const { plan } = req.body;
  if (!['free', 'pro'].includes(plan)) return failure(res, 400, 'plan must be free or pro');
  const org = await Organization.findByIdAndUpdate(req.params.id, { plan }, { new: true });
  if (!org) return failure(res, 404, 'Organization not found');
  return success(res, 200, 'Plan updated', org);
});

module.exports = {
  getPlatformStats,
  getAllUsers,
  deactivateUser,
  getAllOrganizations,
  updateOrganizationPlan,
};
