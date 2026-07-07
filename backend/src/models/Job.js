const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    category: { type: String, default: 'Technology' },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    location: { type: String, default: 'Remote' },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time',
    },
    salaryRange: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' },
    },
    embedding: { type: [Number], default: [] },
    status: { type: String, enum: ['open', 'closed', 'draft'], default: 'open' },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
