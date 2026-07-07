const cron = require('node-cron');
const logger = require('../utils/logger');

/**
 * Placeholder cleanup job. Since resumes go straight to Cloudinary via memory
 * buffers (no local temp files written), there's nothing to clean up by default.
 * Kept here so it's easy to extend if you later switch to disk storage.
 */
function startCleanupCron() {
  cron.schedule('0 3 * * *', () => {
    logger.info('Cleanup cron tick — nothing to clean (memory storage in use).');
  });
}

module.exports = { startCleanupCron };
