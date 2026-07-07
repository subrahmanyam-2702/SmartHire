const express = require('express');
const router = express.Router();
const {
  getMatchesForCandidate,
  getSkillGapForJob,
  getCandidatesForJob,
} = require('../controllers/match.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { aiLimiter } = require('../middlewares/rateLimiter.middleware');

router.get('/candidate', protect, authorize('candidate'), getMatchesForCandidate);
router.get('/candidate/:jobId/skill-gap', protect, authorize('candidate'), aiLimiter, getSkillGapForJob);
router.get('/job/:jobId', protect, authorize('recruiter'), getCandidatesForJob);

module.exports = router;
