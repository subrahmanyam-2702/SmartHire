const { failure } = require('../utils/apiResponse');

/**
 * Usage: router.get('/x', protect, authorize('recruiter', 'admin'), handler)
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return failure(res, 403, `Access denied. Requires role: ${allowedRoles.join(' or ')}`);
    }
    next();
  };
};

module.exports = { authorize };
