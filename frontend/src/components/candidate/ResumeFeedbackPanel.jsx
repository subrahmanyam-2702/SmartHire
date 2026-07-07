import { useState } from 'react';
import toast from 'react-hot-toast';
import { analyzeResume } from '../../api/careerTools.api';

export default function ResumeFeedbackPanel() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const { data } = await analyzeResume();
      setFeedback(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <p className="text-sm text-slate-500 text-center max-w-md mx-auto">
        Get specific, actionable feedback on your uploaded resume — what's working, what's
        missing, and how to improve your ATS score.
      </p>
      <div className="text-center mt-4">
        <button onClick={handleAnalyze} disabled={loading} className="btn-primary">
          {loading ? 'Analyzing...' : 'Analyze My Resume'}
        </button>
      </div>

      {feedback && (
        <div className="mt-8 space-y-5 text-left">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-700 grid place-items-center font-display font-bold text-xl">
              {feedback.atsScore}
            </div>
            <div>
              <p className="font-semibold text-ink">ATS Score</p>
              <p className="text-sm text-slate-500">{feedback.summary}</p>
            </div>
          </div>

          {!!feedback.strengths?.length && (
            <div>
              <h4 className="font-medium text-emerald-700 mb-2">Strengths</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {feedback.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {!!feedback.improvements?.length && (
            <div>
              <h4 className="font-medium text-amber-600 mb-2">Improvements</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {feedback.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
