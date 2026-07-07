import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useMatches } from '../../hooks/useMatches';
import { applyToJob, getMyApplications, getMyInterviews } from '../../api/application.api';
import MatchCard from '../../components/candidate/MatchCard';
import ApplicationCard from '../../components/candidate/ApplicationCard';
import InterviewCard from '../../components/candidate/InterviewCard';
import Loader from '../../components/common/Loader';

const TABS = ['Matches', 'Applications', 'Interviews'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Matches');
  const { matches, loading: matchesLoading, error: matchesError, refetch } = useMatches();
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loadingSecondary, setLoadingSecondary] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  const loadSecondary = async () => {
    setLoadingSecondary(true);
    try {
      const [appsRes, interviewsRes] = await Promise.all([
        getMyApplications(),
        getMyInterviews(),
      ]);
      setApplications(appsRes.data.data);
      setInterviews(interviewsRes.data.data);
    } catch {
      // silent — dashboard still usable via Matches tab
    } finally {
      setLoadingSecondary(false);
    }
  };

  useEffect(() => {
    loadSecondary();
  }, []);

  const handleApply = async (match) => {
    setApplyingId(match._id);
    try {
      await applyToJob(match._id);
      toast.success('Application submitted');
      refetch();
      loadSecondary();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">My Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Jobs matched to your skills and your application statuses
          </p>
        </div>
        <Link to="/candidate/profile" className="btn-secondary">
          Update Profile
        </Link>
      </div>

      <div className="flex gap-2 bg-slate-100 rounded-lg p-1 w-fit mb-6">
        {TABS.map((tab) => {
          const count =
            tab === 'Matches' ? matches.length : tab === 'Applications' ? applications.length : interviews.length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-white shadow-sm text-ink' : 'text-slate-500'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {activeTab === 'Matches' &&
        (matchesLoading ? (
          <Loader label="Finding your best matches..." />
        ) : matchesError ? (
          <p className="text-sm text-amber-600 bg-amber-50 rounded-lg p-4">{matchesError}</p>
        ) : matches.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-16">
            No matches yet — upload a resume on your Profile page to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {matches.map((m) => (
              <MatchCard
                key={m._id}
                match={m}
                onApply={handleApply}
                onViewDetails={(job) => toast(job.description || 'No description available')}
                applying={applyingId === m._id}
              />
            ))}
          </div>
        ))}

      {activeTab === 'Applications' &&
        (loadingSecondary ? (
          <Loader />
        ) : applications.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-16">No applications yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((a) => (
              <ApplicationCard key={a._id} application={a} />
            ))}
          </div>
        ))}

      {activeTab === 'Interviews' &&
        (loadingSecondary ? (
          <Loader />
        ) : interviews.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-16">No interviews scheduled yet.</p>
        ) : (
          <div className="space-y-4">
            {interviews.map((i) => (
              <InterviewCard key={i._id} interview={i} />
            ))}
          </div>
        ))}
    </div>
  );
}
