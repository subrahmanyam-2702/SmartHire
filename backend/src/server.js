require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const { startJobAlertsCron } = require('./jobs/jobAlerts.cron');
const { startCleanupCron } = require('./jobs/cleanupTempFiles.cron');

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  startJobAlertsCron();
  startCleanupCron();

  app.listen(PORT, () => {
    logger.info(`SmartHire API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
})();

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
});
