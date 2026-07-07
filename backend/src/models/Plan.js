const mongoose = require('mongoose');

// Static reference plans. Seed once; read by quota.service.js
const planSchema = new mongoose.Schema({
  name: { type: String, enum: ['free', 'pro'], required: true, unique: true },
  jobPostLimit: { type: Number, required: true },
  resumeUploadLimit: { type: Number, required: true },
  aiCallsPerMonth: { type: Number, required: true },
  priceMonthly: { type: Number, default: 0 },
});

module.exports = mongoose.model('Plan', planSchema);
