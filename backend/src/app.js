const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { notFound, errorHandler } = require('./middlewares/error.middleware');
const { apiLimiter } = require('./middlewares/rateLimiter.middleware');

const authRoutes = require('./routes/auth.routes');
const candidateProfileRoutes = require('./routes/candidateProfile.routes');
const resumeRoutes = require('./routes/resume.routes');
const jobRoutes = require('./routes/job.routes');
const matchRoutes = require('./routes/match.routes');
const applicationRoutes = require('./routes/application.routes');
const careerToolsRoutes = require('./routes/careerTools.routes');
const messageRoutes = require('./routes/message.routes');
const notificationRoutes = require('./routes/notification.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// CLIENT_URL can be a single origin or a comma-separated list, e.g.:
// CLIENT_URL=https://smart-hire-jade.vercel.app,https://smart-hire-preview-xyz.vercel.app
// IMPORTANT: origin: '*' combined with credentials: true is invalid per the
// CORS spec and browsers will silently block every request. We reflect back
// the actual allowed origin instead.
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, Postman, server-to-server) with no Origin header
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use('/api', apiLimiter);

app.get('/', (req, res) => res.json({ success: true, message: 'SmartHire API is running' }));
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/candidate/profile', candidateProfileRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/career-tools', careerToolsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;