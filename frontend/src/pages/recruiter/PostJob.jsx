import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createJob } from '../../api/job.api';
import JobForm from '../../components/recruiter/JobForm';

export default function PostJob() {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      await createJob(payload);
      toast.success('Job posted successfully');
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink mb-6">Post a Job</h1>
      <JobForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
