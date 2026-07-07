const express = require('express');
const router = express.Router();
const { analyzeResume, getCareerGrowthPlan } = require('../controllers/careerTools.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { aiLimiter } = require('../middlewares/rateLimiter.middleware');

router.use(protect, authorize('candidate'), aiLimiter);

router.post('/resume-feedback', analyzeResume);
router.post('/growth-plan', getCareerGrowthPlan);

module.exports = router;
