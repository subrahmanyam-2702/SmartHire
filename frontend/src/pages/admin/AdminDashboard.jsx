import { useEffect, useState } from 'react';
import { getPlatformStats } from '../../api/admin.api';
import StatsCards from '../../components/admin/StatsCards';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await getPlatformStats();
      setStats(data.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink mb-6">Platform Overview</h1>
      <StatsCards stats={stats} />
      <div className="flex gap-3">
        <Link to="/admin/users" className="btn-secondary">
          Manage Users
        </Link>
        <Link to="/admin/organizations" className="btn-secondary">
          Manage Organizations
        </Link>
      </div>
    </div>
  );
}
