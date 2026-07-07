import { useEffect, useState } from 'react';
import { getRecruiterAnalytics } from '../../api/analytics.api';
import Loader from '../../components/common/Loader';

const FUNNEL_ORDER = [
  'applied',
  'shortlisted',
  'interview_scheduled',
  'interviewed',
  'offered',
  'hired',
  'rejected',
];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await getRecruiterAnalytics();
      setStats(data.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader />;
  if (!stats) return null;

  const maxCount = Math.max(1, ...Object.values(stats.funnel));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink mb-6">Analytics</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-2xl font-display font-bold text-brand-600">{stats.totalJobs}</p>
          <p className="text-xs text-slate-500 mt-1">Jobs Posted</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-display font-bold text-brand-600">
            {stats.totalApplications}
          </p>
          <p className="text-xs text-slate-500 mt-1">Applications</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-display font-bold text-brand-600">
            {stats.avgMatchScore}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Avg Match Score</p>
        </div>
      </div>

      <div className="card">
        <h2 className="font-display font-semibold text-ink mb-4">Hiring Funnel</h2>
        <div className="space-y-3">
          {FUNNEL_ORDER.map((stage) => (
            <div key={stage} className="flex items-center gap-3">
              <span className="w-32 text-xs text-slate-500 capitalize shrink-0">
                {stage.replace('_', ' ')}
              </span>
              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-brand-500 h-full rounded-full"
                  style={{ width: `${(stats.funnel[stage] / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-600 w-6 text-right">
                {stats.funnel[stage]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
