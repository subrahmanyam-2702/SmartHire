const STATUS_LABELS = {
  applied: { label: 'Applied', color: 'bg-slate-100 text-slate-600' },
  shortlisted: { label: 'Shortlisted', color: 'bg-brand-50 text-brand-700' },
  interview_scheduled: { label: 'Interview Scheduled', color: 'bg-amber-50 text-amber-600' },
  interviewed: { label: 'Interviewed', color: 'bg-amber-50 text-amber-600' },
  offered: { label: 'Offered', color: 'bg-emerald-50 text-emerald-600' },
  hired: { label: 'Hired', color: 'bg-emerald-50 text-emerald-700' },
  rejected: { label: 'Not Selected', color: 'bg-red-50 text-red-500' },
};

export default function ApplicationCard({ application }) {
  const status = STATUS_LABELS[application.status] || STATUS_LABELS.applied;

  return (
    <div className="card flex items-center justify-between gap-4">
      <div>
        <h3 className="font-display font-semibold text-ink">{application.job?.title}</h3>
        <p className="text-sm text-slate-500">{application.job?.companyName}</p>
        {application.aiExplanation && (
          <p className="text-xs text-slate-400 mt-2 italic">"{application.aiExplanation}"</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
          {status.label}
        </span>
        <p className="text-xs text-slate-400 mt-1">{application.matchScore}% match</p>
      </div>
    </div>
  );
}
