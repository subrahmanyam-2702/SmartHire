const mongoose = require('mongoose');

const savedSearchSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    keywords: { type: [String], default: [] },
    location: { type: String, default: '' },
    minMatchScore: { type: Number, default: 70 },
    lastNotifiedAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavedSearch', savedSearchSchema);
