export default function CandidateMatchCard({ candidate, onMessage }) {
  return (
    <div className="card flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h3 className="font-display font-semibold text-ink">{candidate.name}</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
            {candidate.matchScore}% match
          </span>
        </div>
        <p className="text-sm text-slate-500">{candidate.careerGoal}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {candidate.skills?.slice(0, 6).map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
      </div>
      <button onClick={() => onMessage(candidate)} className="btn-primary text-sm shrink-0">
        Invite / Message
      </button>
    </div>
  );
}
