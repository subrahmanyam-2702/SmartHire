const PLANS = [
  {
    name: 'Free',
    price: '$0',
    features: ['3 job posts/month', '5 resume uploads/month', '50 AI calls/month', 'Semantic matching'],
  },
  {
    name: 'Pro',
    price: 'Contact us',
    features: ['Unlimited job posts', 'Unlimited resume uploads', 'Unlimited AI calls', 'Priority support'],
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink text-center">
        Simple, free-to-start pricing
      </h1>
      <p className="text-slate-500 text-center mt-2">
        Powered entirely by free-tier AI — Groq and Hugging Face.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mt-10">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`card ${plan.highlighted ? 'ring-2 ring-brand-500' : ''}`}
          >
            <h3 className="font-display font-semibold text-xl text-ink">{plan.name}</h3>
            <p className="text-3xl font-display font-bold text-brand-600 mt-2">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
