const Organization = require('../models/Organization');
const CandidateProfile = require('../models/CandidateProfile');

const LIMITS = {
  free: {
    jobPostLimit: Number(process.env.FREE_PLAN_JOB_LIMIT) || 3,
    resumeUploadLimit: Number(process.env.FREE_PLAN_RESUME_LIMIT) || 5,
    aiCallsPerMonth: Number(process.env.FREE_PLAN_AI_CALLS_PER_MONTH) || 50,
  },
  pro: {
    jobPostLimit: Infinity,
    resumeUploadLimit: Infinity,
    aiCallsPerMonth: Infinity,
  },
};

function isNewMonth(lastReset) {
  const now = new Date();
  const last = new Date(lastReset);
  return now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear();
}

async function checkAndIncrementOrgJobPost(orgId) {
  const org = await Organization.findById(orgId);
  if (!org) throw new Error('Organization not found');

  if (isNewMonth(org.usage.lastResetAt)) {
    org.usage.jobsPostedThisMonth = 0;
    org.usage.aiCallsThisMonth = 0;
    org.usage.lastResetAt = new Date();
  }

  const limit = LIMITS[org.plan].jobPostLimit;
  if (org.usage.jobsPostedThisMonth >= limit) {
    throw new Error(
      `Free plan limit reached: ${limit} job posts/month. Upgrade to Pro to post more.`
    );
  }

  org.usage.jobsPostedThisMonth += 1;
  await org.save();
}

async function checkAndIncrementOrgAiCall(orgId) {
  const org = await Organization.findById(orgId);
  if (!org) throw new Error('Organization not found');

  if (isNewMonth(org.usage.lastResetAt)) {
    org.usage.jobsPostedThisMonth = 0;
    org.usage.aiCallsThisMonth = 0;
    org.usage.lastResetAt = new Date();
  }

  const limit = LIMITS[org.plan].aiCallsPerMonth;
  if (org.usage.aiCallsThisMonth >= limit) {
    throw new Error('Free plan AI call limit reached this month. Upgrade to Pro for more.');
  }

  org.usage.aiCallsThisMonth += 1;
  await org.save();
}

async function checkAndIncrementCandidateResumeUpload(candidateProfileId) {
  const profile = await CandidateProfile.findById(candidateProfileId);
  if (!profile) throw new Error('Candidate profile not found');

  if (isNewMonth(profile.usageResetAt)) {
    profile.resumeUploadsThisMonth = 0;
    profile.aiCallsThisMonth = 0;
    profile.usageResetAt = new Date();
  }

  const limit = LIMITS.free.resumeUploadLimit; // candidates are always on the free tier for now
  if (profile.resumeUploadsThisMonth >= limit) {
    throw new Error(`Free plan limit reached: ${limit} resume uploads/month.`);
  }

  profile.resumeUploadsThisMonth += 1;
  await profile.save();
}

async function checkAndIncrementCandidateAiCall(candidateProfileId) {
  const profile = await CandidateProfile.findById(candidateProfileId);
  if (!profile) throw new Error('Candidate profile not found');

  if (isNewMonth(profile.usageResetAt)) {
    profile.resumeUploadsThisMonth = 0;
    profile.aiCallsThisMonth = 0;
    profile.usageResetAt = new Date();
  }

  const limit = LIMITS.free.aiCallsPerMonth;
  if (profile.aiCallsThisMonth >= limit) {
    throw new Error('Free plan AI call limit reached this month.');
  }

  profile.aiCallsThisMonth += 1;
  await profile.save();
}

module.exports = {
  LIMITS,
  checkAndIncrementOrgJobPost,
  checkAndIncrementOrgAiCall,
  checkAndIncrementCandidateResumeUpload,
  checkAndIncrementCandidateAiCall,
};
