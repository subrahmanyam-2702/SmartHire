import { useState } from 'react';
import toast from 'react-hot-toast';
import { getCareerGrowthPlan } from '../../api/careerTools.api';

export default function CareerGrowthPlanPanel() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data } = await getCareerGrowthPlan();
      setPlan(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate growth plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <p className="text-sm text-slate-500 text-center max-w-md mx-auto">
        Get a step-by-step roadmap toward your career goal, based on your current skills and
        experience.
      </p>
      <div className="text-center mt-4">
        <button onClick={handleGenerate} disabled={loading} className="btn-primary">
          {loading ? 'Generating...' : 'Generate Growth Plan'}
        </button>
      </div>

      {plan && (
        <div className="mt-8 space-y-6 text-left">
          {!!plan.roadmap?.length && (
            <ol className="relative border-l border-slate-200 ml-3 space-y-6">
              {plan.roadmap.map((step, i) => (
                <li key={i} className="ml-4">
                  <div className="absolute w-2.5 h-2.5 bg-brand-600 rounded-full -left-[5px] mt-1.5" />
                  <p className="text-xs text-slate-400">{step.estimatedTime}</p>
                  <h4 className="font-semibold text-ink">{step.title}</h4>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </li>
              ))}
            </ol>
          )}

          {!!plan.recommendedSkills?.length && (
            <div>
              <h4 className="font-medium text-ink mb-2">Recommended skills to learn next</h4>
              <div className="flex flex-wrap gap-2">
                {plan.recommendedSkills.map((skill) => (
                  <span key={skill} className="tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
