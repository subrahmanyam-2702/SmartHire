import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { isCandidate, isRecruiter } from '../../utils/roleCheck';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-brand-600' : 'text-slate-600 hover:text-ink'
  }`;

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={user ? undefined : '/'}
          className="flex items-center gap-2"
          onClick={closeMenu}
        >
          <span className="w-8 h-8 rounded-lg bg-brand-600 text-white grid place-items-center font-display font-bold">
            S
          </span>

          <span className="font-display font-bold text-lg text-ink">
            Smart<span className="text-brand-600">Hire</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-6">
            {isCandidate(role) && (
              <>
                <NavLink to="/candidate" end className={linkClass}>
                  Dashboard
                </NavLink>

                <NavLink
                  to="/candidate/profile"
                  className={linkClass}
                >
                  Profile
                </NavLink>

                <NavLink
                  to="/candidate/career-tools"
                  className={linkClass}
                >
                  Career Tools
                </NavLink>

                <NavLink
                  to="/candidate/messages"
                  className={linkClass}
                >
                  Messages
                </NavLink>
              </>
            )}

            {isRecruiter(role) && (
              <>
                <NavLink to="/recruiter" end className={linkClass}>
                  Dashboard
                </NavLink>

                <NavLink
                  to="/recruiter/jobs"
                  className={linkClass}
                >
                  Jobs
                </NavLink>

                <NavLink
                  to="/recruiter/analytics"
                  className={linkClass}
                >
                  Analytics
                </NavLink>

                <NavLink
                  to="/recruiter/messages"
                  className={linkClass}
                >
                  Messages
                </NavLink>
              </>
            )}
          </nav>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-brand-700 font-medium capitalize">
                {role}
              </span>

              <button
                onClick={handleLogout}
                className="hidden md:block text-sm text-slate-500 hover:text-ink"
              >
                Logout
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-ink"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn-primary text-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && user && (
        <nav className="md:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex flex-col gap-4">
            {isCandidate(role) && (
              <>
                <NavLink
                  to="/candidate"
                  end
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/candidate/profile"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>

                <NavLink
                  to="/candidate/career-tools"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Career Tools
                </NavLink>

                <NavLink
                  to="/candidate/messages"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Messages
                </NavLink>
              </>
            )}

            {isRecruiter(role) && (
              <>
                <NavLink
                  to="/recruiter"
                  end
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/recruiter/jobs"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Jobs
                </NavLink>

                <NavLink
                  to="/recruiter/analytics"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Analytics
                </NavLink>

                <NavLink
                  to="/recruiter/messages"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Messages
                </NavLink>
              </>
            )}

            <button
              onClick={handleLogout}
              className="text-left text-red-600 font-medium pt-2 border-t border-slate-200"
            >
              Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}