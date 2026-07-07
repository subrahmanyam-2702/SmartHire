import { useState } from 'react';
import ResumeFeedbackPanel from '../../components/candidate/ResumeFeedbackPanel';
import CareerGrowthPlanPanel from '../../components/candidate/CareerGrowthPlanPanel';

const TABS = ['Resume Feedback', 'Career Growth Plan'];

export default function CareerTools() {
  const [activeTab, setActiveTab] = useState('Resume Feedback');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink">Career Tools</h1>
      <p className="text-slate-500 mt-1 mb-6">
        AI-powered tools to improve your resume and plan your career growth.
      </p>

      <div className="flex gap-2 bg-slate-100 rounded-lg p-1 w-fit mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-white shadow-sm text-ink' : 'text-slate-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Resume Feedback' ? <ResumeFeedbackPanel /> : <CareerGrowthPlanPanel />}
    </div>
  );
}
