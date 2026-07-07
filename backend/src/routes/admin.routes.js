const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllUsers,
  deactivateUser,
  getAllOrganizations,
  updateOrganizationPlan,
} = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(protect, authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.put('/users/:id/deactivate', deactivateUser);
router.get('/organizations', getAllOrganizations);
router.put('/organizations/:id/plan', updateOrganizationPlan);

module.exports = router;
