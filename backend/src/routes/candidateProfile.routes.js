const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  regenerateEmbedding,
} = require('../controllers/candidateProfile.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { aiLimiter } = require('../middlewares/rateLimiter.middleware');

router.use(protect, authorize('candidate'));

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/regenerate-embedding', aiLimiter, regenerateEmbedding);

module.exports = router;
