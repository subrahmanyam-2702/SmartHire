export default function StatsCards({ stats }) {
  if (!stats) return null;
  const items = [
    ['Users', stats.userCount],
    ['Organizations', stats.orgCount],
    ['Jobs', stats.jobCount],
    ['Applications', stats.applicationCount],
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {items.map(([label, value]) => (
        <div key={label} className="card text-center">
          <p className="text-2xl font-display font-bold text-brand-600">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
