import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllUsers, deactivateUser } from '../../api/admin.api';
import UserTable from '../../components/admin/UserTable';
import Loader from '../../components/common/Loader';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    const { data } = await getAllUsers();
    setUsers(data.data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeactivate = async (id) => {
    try {
      await deactivateUser(id);
      toast.success('User deactivated');
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate user');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink mb-6">Manage Users</h1>
      <UserTable users={users} onDeactivate={handleDeactivate} />
    </div>
  );
}
