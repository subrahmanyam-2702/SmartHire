import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyJobs } from '../../api/job.api';
import { getRecruiterAnalytics } from '../../api/analytics.api';
import JobCard from '../../components/recruiter/JobCard';
import Loader from '../../components/common/Loader';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [jobsRes, statsRes] = await Promise.all([getMyJobs(), getRecruiterAnalytics()]);
        setJobs(jobsRes.data.data);
        setStats(statsRes.data.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">Recruiter Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your job posts and candidate pipeline</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn-primary">
          + Post a Job
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            ['Jobs Posted', stats.totalJobs],
            ['Applications', stats.totalApplications],
            ['Avg Match Score', `${stats.avgMatchScore}%`],
            ['Hired', stats.funnel?.hired || 0],
          ].map(([label, value]) => (
            <div key={label} className="card text-center">
              <p className="text-2xl font-display font-bold text-brand-600">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display font-semibold text-lg text-ink mb-3">Your Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-16">
          No jobs posted yet. Post your first job to start matching with candidates.
        </p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
