import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../../api/auth.api';
import { useAuth } from '../../hooks/useAuth';
import { homeRouteForRole } from '../../utils/roleCheck';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    organizationName: '',
  });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      setAuth(data.data.user, data.data.token);
      toast.success('Account created!');
      navigate(homeRouteForRole(data.data.user.role));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4">
        <h1 className="font-display font-bold text-2xl text-ink">Create your account</h1>

        <div className="grid grid-cols-2 gap-2">
          {['candidate', 'recruiter'].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setForm({ ...form, role: r })}
              className={`py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                form.role === r
                  ? 'bg-brand-600 border-brand-600 text-white'
                  : 'border-slate-300 text-slate-600'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
          <input
            required
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {form.role === 'recruiter' && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Company / Organization Name
            </label>
            <input
              className="input-field"
              value={form.organizationName}
              onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
          <input
            type="email"
            required
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-sm text-slate-500 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
