import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
      {/* <span className="tag mb-4 inline-block">Free AI · Groq + Hugging Face</span> */}
      <h1 className="font-display font-bold text-4xl sm:text-5xl text-ink leading-tight">
        Hiring, matched by meaning —{' '}
        <span className="text-brand-600">not just keywords.</span>
      </h1>
      <p className="text-slate-500 mt-4 max-w-xl mx-auto">
        SmartHire uses semantic embeddings to match candidates and jobs on what they actually
        mean, then explains every match in plain English.
      </p>
      <div className="flex items-center justify-center gap-3 mt-8">
        <Link to="/register" className="btn-primary">
          Get Started Free
        </Link>
        <Link to="/login" className="btn-secondary">
          Login
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mt-16 text-left">
        {[
          ['Semantic Matching', 'Cosine-similarity ranking over Hugging Face embeddings — real search, not keyword filters.'],
          ['AI Career Tools', 'Groq-powered resume feedback, ATS scoring, and growth plans in seconds.'],
          ['Built-in Messaging', 'Recruiters invite, candidates reply — all in one place.'],
        ].map(([title, desc]) => (
          <div key={title} className="card">
            <h3 className="font-display font-semibold text-ink">{title}</h3>
            <p className="text-sm text-slate-500 mt-2">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
