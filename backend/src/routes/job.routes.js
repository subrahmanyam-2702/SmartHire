const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/job.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { aiLimiter } = require('../middlewares/rateLimiter.middleware');

// Public/candidate browse
router.get('/', protect, getJobs);
router.get('/mine', protect, authorize('recruiter'), getMyJobs);
router.get('/:id', protect, getJobById);

// Recruiter-only mutations
router.post('/', protect, authorize('recruiter'), aiLimiter, createJob);
router.put('/:id', protect, authorize('recruiter'), aiLimiter, updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);

module.exports = router;
