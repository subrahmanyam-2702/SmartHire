const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String },
    rawText: { type: String, default: '' },
    aiExtracted: {
      skills: { type: [String], default: [] },
      experience: { type: String, default: '' },
      careerGoal: { type: String, default: '' },
      yearsOfExperience: { type: Number, default: 0 },
    },
    atsScore: { type: Number, min: 0, max: 100 },
    feedback: {
      summary: String,
      strengths: [String],
      improvements: [String],
      generatedAt: Date,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
