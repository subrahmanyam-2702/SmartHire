const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['free', 'pro'], default: 'free' },
    usage: {
      jobsPostedThisMonth: { type: Number, default: 0 },
      aiCallsThisMonth: { type: Number, default: 0 },
      lastResetAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', organizationSchema);
