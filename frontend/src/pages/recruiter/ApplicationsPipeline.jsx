import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getApplicationsForJob } from '../../api/application.api';
import PipelineBoard from '../../components/recruiter/PipelineBoard';
import Loader from '../../components/common/Loader';

export default function ApplicationsPipeline() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getApplicationsForJob(jobId);
      setApplications(data.data);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink mb-6">Applications Pipeline</h1>

      {applications.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-16">No applications yet.</p>
      ) : (
        <PipelineBoard applications={applications} onUpdated={loadApplications} />
      )}
    </div>
  );
}
