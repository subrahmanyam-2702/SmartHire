const express = require('express');
const router = express.Router();
const { uploadResume, getMyResumes, getLatestResume } = require('../controllers/resume.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { uploadResume: uploadMiddleware } = require('../middlewares/upload.middleware');
const { aiLimiter } = require('../middlewares/rateLimiter.middleware');

router.use(protect, authorize('candidate'));

router.post('/upload', aiLimiter, uploadMiddleware.single('resume'), uploadResume);
router.get('/', getMyResumes);
router.get('/latest', getLatestResume);

module.exports = router;
