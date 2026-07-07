const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getMyInterviews,
  getApplicationsForJob,
  updateApplicationStatus,
  generateCoverLetterForApplication,
} = require('../controllers/application.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { aiLimiter } = require('../middlewares/rateLimiter.middleware');

// Candidate
router.post('/', protect, authorize('candidate'), applyToJob);
router.get('/candidate', protect, authorize('candidate'), getMyApplications);
router.get('/candidate/interviews', protect, authorize('candidate'), getMyInterviews);
router.post(
  '/:id/cover-letter',
  protect,
  authorize('candidate'),
  aiLimiter,
  generateCoverLetterForApplication
);

// Recruiter
router.get('/job/:jobId', protect, authorize('recruiter'), getApplicationsForJob);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
