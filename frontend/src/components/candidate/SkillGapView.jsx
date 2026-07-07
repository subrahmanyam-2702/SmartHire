import { useState } from 'react';
import toast from 'react-hot-toast';
import { getSkillGapForJob } from '../../api/match.api';

export default function SkillGapView({ jobId }) {
  const [loading, setLoading] = useState(false);
  const [gap, setGap] = useState(null);

  const handleCheck = async () => {
    setLoading(true);
    try {
      const { data } = await getSkillGapForJob(jobId);
      setGap(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze skill gap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCheck} disabled={loading} className="btn-secondary text-sm">
        {loading ? 'Checking...' : 'Check Skill Gap'}
      </button>

      {gap && (
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-emerald-700 mb-2">You have</h4>
            <div className="flex flex-wrap gap-2">
              {gap.matchedSkills?.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-amber-600 mb-2">Missing</h4>
            <div className="flex flex-wrap gap-2">
              {gap.missingSkills?.map((s) => (
                <span key={s} className="tag bg-amber-50 text-amber-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
