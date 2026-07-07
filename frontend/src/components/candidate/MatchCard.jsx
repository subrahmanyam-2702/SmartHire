export default function MatchCard({ match, onViewDetails, onApply, applying }) {
  const scoreColor =
    match.matchScore >= 80
      ? 'text-emerald-600 bg-emerald-50'
      : match.matchScore >= 60
      ? 'text-amber-600 bg-amber-50'
      : 'text-slate-600 bg-slate-100';

  return (
    <div className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-display font-semibold text-ink text-lg">{match.title}</h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scoreColor}`}>
            {match.matchScore}% match
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">
          {match.companyName} {match.category ? `· ${match.category}` : ''}
        </p>
        {match.description && (
          <p className="text-sm text-slate-500 mt-2 line-clamp-2">{match.description}</p>
        )}
        {!!match.requirements?.length && (
          <div className="flex flex-wrap gap-2 mt-3">
            {match.requirements.slice(0, 5).map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
            {match.requirements.length > 5 && (
              <span className="text-xs text-slate-400 self-center">
                +{match.requirements.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex sm:flex-col gap-2 shrink-0">
        <button onClick={() => onViewDetails(match)} className="btn-secondary text-sm">
          View Details
        </button>
        {!match.alreadyApplied ? (
          <button
            onClick={() => onApply(match)}
            disabled={applying}
            className="btn-primary text-sm"
          >
            {applying ? 'Applying...' : 'Apply'}
          </button>
        ) : (
          <span className="text-xs text-center text-emerald-600 font-medium self-center">
            Applied ✓
          </span>
        )}
      </div>
    </div>
  );
}
