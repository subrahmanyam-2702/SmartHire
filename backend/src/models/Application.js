const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    matchScore: { type: Number, min: 0, max: 100, default: 0 },
    aiExplanation: { type: String, default: '' },
    status: {
      type: String,
      enum: [
        'applied',
        'shortlisted',
        'interview_scheduled',
        'interviewed',
        'offered',
        'rejected',
        'hired',
      ],
      default: 'applied',
    },
    interview: {
      date: Date,
      meetingLink: String,
      notes: String,
    },
    coverLetter: { type: String, default: '' },
  },
  { timestamps: true }
);

applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
