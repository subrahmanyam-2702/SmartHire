import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateApplicationStatus } from '../../api/application.api';

const STATUSES = [
  'applied',
  'shortlisted',
  'interview_scheduled',
  'interviewed',
  'offered',
  'hired',
  'rejected',
];

export default function PipelineBoard({ applications, onUpdated }) {
  const [scheduling, setScheduling] = useState(null); // application id being scheduled
  const [interviewDate, setInterviewDate] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  const handleStatusChange = async (application, status) => {
    if (status === 'interview_scheduled') {
      setScheduling(application._id);
      return;
    }
    try {
      await updateApplicationStatus(application._id, { status });
      toast.success('Status updated');
      onUpdated?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const confirmSchedule = async (application) => {
    if (!interviewDate) return toast.error('Pick an interview date/time');
    try {
      await updateApplicationStatus(application._id, {
        status: 'interview_scheduled',
        interviewDate,
        meetingLink,
      });
      toast.success('Interview scheduled — candidate notified');
      setScheduling(null);
      setInterviewDate('');
      setMeetingLink('');
      onUpdated?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule interview');
    }
  };

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app._id} className="card">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-ink">{app.candidate?.name}</h3>
              <p className="text-sm text-slate-500">{app.candidate?.email}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
              {app.matchScore}% match
            </span>
            <select
              className="input-field w-auto"
              value={app.status}
              onChange={(e) => handleStatusChange(app, e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {scheduling === app._id && (
            <div className="mt-4 border-t border-slate-100 pt-4 grid sm:grid-cols-2 gap-3">
              <input
                type="datetime-local"
                className="input-field"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
              <input
                type="url"
                placeholder="Meeting link (optional)"
                className="input-field"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
              <button onClick={() => confirmSchedule(app)} className="btn-primary sm:col-span-2">
                Confirm Interview
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
