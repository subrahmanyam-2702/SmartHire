import { Link } from 'react-router-dom';

export default function JobCard({ job, onDelete }) {
  return (
    <div className="card flex items-center justify-between gap-4">
      <div>
        <h3 className="font-display font-semibold text-ink">{job.title}</h3>
        <p className="text-sm text-slate-500">
          {job.companyName} · {job.location} ·{' '}
          <span className="capitalize">{job.status}</span>
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Link to={`/recruiter/jobs/${job._id}/matches`} className="btn-secondary text-sm">
          Candidates
        </Link>
        <Link to={`/recruiter/jobs/${job._id}/applications`} className="btn-secondary text-sm">
          Applications
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(job._id)}
            className="text-sm text-red-500 hover:text-red-700 px-2"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
