const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, trim: true, default: '' },
    careerGoal: { type: String, trim: true, default: '' },
    yearsOfExperience: { type: Number, default: 0, min: 0 },
    skills: { type: [String], default: [] },
    embedding: { type: [Number], default: [] },
    embeddingUpdatedAt: { type: Date },
    resumeUploadsThisMonth: { type: Number, default: 0 },
    aiCallsThisMonth: { type: Number, default: 0 },
    usageResetAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
