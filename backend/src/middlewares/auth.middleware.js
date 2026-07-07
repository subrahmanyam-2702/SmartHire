const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { failure } = require('../utils/apiResponse');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return failure(res, 401, 'Not authorized, no token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return failure(res, 401, 'Not authorized, user not found or deactivated');
    }

    req.user = user;
    next();
  } catch (err) {
    return failure(res, 401, 'Not authorized, invalid or expired token');
  }
});

module.exports = { protect };
