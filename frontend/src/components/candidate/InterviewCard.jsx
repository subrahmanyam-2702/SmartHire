import { formatDateTime } from '../../utils/formatDate';

export default function InterviewCard({ interview }) {
  return (
    <div className="card">
      <h3 className="font-display font-semibold text-ink">{interview.job?.title}</h3>
      <p className="text-sm text-slate-500">{interview.job?.companyName}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="tag">{formatDateTime(interview.interview?.date)}</span>
        {interview.interview?.meetingLink && (
          <a
            href={interview.interview.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 font-medium hover:underline"
          >
            Join meeting →
          </a>
        )}
      </div>

      {interview.interview?.notes && (
        <p className="text-sm text-slate-500 mt-2">{interview.interview.notes}</p>
      )}
    </div>
  );
}
