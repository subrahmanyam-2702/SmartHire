const express = require('express');
const router = express.Router();
const { getRecruiterAnalytics } = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.get('/recruiter', protect, authorize('recruiter'), getRecruiterAnalytics);

module.exports = router;
