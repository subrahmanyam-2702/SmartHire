import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllOrganizations, updateOrganizationPlan } from '../../api/admin.api';
import Loader from '../../components/common/Loader';

export default function ManageOrganizations() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrgs = async () => {
    const { data } = await getAllOrganizations();
    setOrgs(data.data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrgs();
  }, []);

  const handlePlanChange = async (id, plan) => {
    try {
      await updateOrganizationPlan(id, plan);
      toast.success('Plan updated');
      loadOrgs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update plan');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink mb-6">Manage Organizations</h1>
      <div className="space-y-3">
        {orgs.map((org) => (
          <div key={org._id} className="card flex items-center justify-between">
            <div>
              <p className="font-semibold text-ink">{org.name}</p>
              <p className="text-sm text-slate-500">{org.owner?.email}</p>
            </div>
            <select
              className="input-field w-auto"
              value={org.plan}
              onChange={(e) => handlePlanChange(org._id, e.target.value)}
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
