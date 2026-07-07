import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyJobs, deleteJob } from '../../api/job.api';
import JobCard from '../../components/recruiter/JobCard';
import Loader from '../../components/common/Loader';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const { data } = await getMyJobs();
      setJobs(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      toast.success('Job deleted');
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete job');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-3xl text-ink">Manage Jobs</h1>
        <Link to="/recruiter/jobs/new" className="btn-primary">
          + Post a Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-16">No jobs posted yet.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
