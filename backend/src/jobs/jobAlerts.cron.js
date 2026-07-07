const cron = require('node-cron');
const SavedSearch = require('../models/SavedSearch');
const Job = require('../models/Job');
const CandidateProfile = require('../models/CandidateProfile');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { rankJobsForCandidate } = require('../services/matching.service');
const { sendEmail } = require('../services/email.service');
const logger = require('../utils/logger');

async function runJobAlerts() {
  logger.info('Running job alerts cron...');
  const searches = await SavedSearch.find({ active: true });

  for (const search of searches) {
    const profile = await CandidateProfile.findOne({ user: search.candidate });
    if (!profile?.embedding?.length) continue;

    const sinceDate = search.lastNotifiedAt || new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newJobs = await Job.find({ status: 'open', createdAt: { $gt: sinceDate } });
    if (!newJobs.length) continue;

    const ranked = rankJobsForCandidate(profile.embedding, newJobs).filter(
      (r) => r.matchScore >= (search.minMatchScore || 70)
    );
    if (!ranked.length) continue;

    const user = await User.findById(search.candidate);
    const jobListHtml = ranked
      .slice(0, 5)
      .map((r) => `<li>${r.job.title} at ${r.job.companyName} — ${r.matchScore}% match</li>`)
      .join('');

    await sendEmail({
      to: user.email,
      subject: `SmartHire: ${ranked.length} new job match${ranked.length > 1 ? 'es' : ''} for you`,
      html: `<p>Hi ${user.name}, we found new jobs matching your profile:</p><ul>${jobListHtml}</ul>`,
    });

    await Notification.create({
      user: user._id,
      type: 'job_alert',
      message: `${ranked.length} new job match(es) found`,
      link: '/candidate',
    });

    search.lastNotifiedAt = new Date();
    await search.save();
  }
  logger.info('Job alerts cron finished.');
}

function startJobAlertsCron() {
  // Runs once a day at 8am server time
  cron.schedule('0 8 * * *', runJobAlerts);
}

module.exports = { startJobAlertsCron, runJobAlerts };
