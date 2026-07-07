const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Organization = require('../models/Organization');
const CandidateProfile = require('../models/CandidateProfile');
const generateToken = require('../utils/generateToken');
const { success, failure } = require('../utils/apiResponse');

/**
 * @route POST /api/auth/register
 * body: { name, email, password, role, organizationName? }
 * role = 'candidate' | 'recruiter'
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, organizationName } = req.body;

  if (!name || !email || !password || !role) {
    return failure(res, 400, 'name, email, password and role are required');
  }
  if (!['candidate', 'recruiter'].includes(role)) {
    return failure(res, 400, 'role must be candidate or recruiter');
  }

  const existing = await User.findOne({ email });
  if (existing) return failure(res, 400, 'An account with this email already exists');

  const user = await User.create({ name, email, password, role });

  if (role === 'recruiter') {
    const org = await Organization.create({
      name: organizationName || `${name}'s Organization`,
      owner: user._id,
    });
    user.organization = org._id;
    await user.save();
  }

  if (role === 'candidate') {
    await CandidateProfile.create({ user: user._id, fullName: name });
  }

  const token = generateToken(user._id, user.role);

  return success(res, 201, 'Account created successfully', {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

/**
 * @route POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return failure(res, 400, 'email and password are required');

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return failure(res, 401, 'Invalid email or password');
  }
  if (!user.isActive) return failure(res, 403, 'This account has been deactivated');

  const token = generateToken(user._id, user.role);

  return success(res, 200, 'Login successful', {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

/**
 * @route GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  return success(res, 200, 'Current user', {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    organization: req.user.organization,
  });
});

module.exports = { register, login, getMe };
