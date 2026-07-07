import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isCandidate, isRecruiter } from '../../utils/roleCheck';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-brand-600' : 'text-slate-600 hover:text-ink'
  }`;

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to={user ? undefined : '/'} className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand-600 text-white grid place-items-center font-display font-bold">
            S
          </span>
          <span className="font-display font-bold text-lg text-ink">
            Smart<span className="text-brand-600">Hire</span>
          </span>
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-6">
            {isCandidate(role) && (
              <>
                <NavLink to="/candidate" end className={linkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/candidate/profile" className={linkClass}>
                  Profile
                </NavLink>
                <NavLink to="/candidate/career-tools" className={linkClass}>
                  Career Tools
                </NavLink>
                <NavLink to="/candidate/messages" className={linkClass}>
                  Messages
                </NavLink>
              </>
            )}
            {isRecruiter(role) && (
              <>
                <NavLink to="/recruiter" end className={linkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/recruiter/jobs" className={linkClass}>
                  Jobs
                </NavLink>
                <NavLink to="/recruiter/analytics" className={linkClass}>
                  Analytics
                </NavLink>
                <NavLink to="/recruiter/messages" className={linkClass}>
                  Messages
                </NavLink>
              </>
            )}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-brand-700 font-medium capitalize">
                {role}
              </span>
              <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-ink">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-ink">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
