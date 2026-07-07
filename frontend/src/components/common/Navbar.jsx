import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isCandidate, isRecruiter } from '../../utils/roleCheck';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-brand-600' : 'text-slate-600 hover:text-ink'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block px-4 py-3 text-sm font-medium border-b border-slate-100 ${
    isActive ? 'text-brand-600 bg-brand-50' : 'text-slate-600'
  }`;

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const candidateLinks = [
    { to: '/candidate', label: 'Dashboard', end: true },
    { to: '/candidate/profile', label: 'Profile' },
    { to: '/candidate/career-tools', label: 'Career Tools' },
    { to: '/candidate/messages', label: 'Messages' },
  ];

  const recruiterLinks = [
    { to: '/recruiter', label: 'Dashboard', end: true },
    { to: '/recruiter/jobs', label: 'Jobs' },
    { to: '/recruiter/analytics', label: 'Analytics' },
    { to: '/recruiter/messages', label: 'Messages' },
  ];

  const links = isCandidate(role) ? candidateLinks : isRecruiter(role) ? recruiterLinks : [];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to={user ? undefined : '/'}
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="w-8 h-8 rounded-lg bg-brand-600 text-white grid place-items-center font-display font-bold">
            S
          </span>
          <span className="font-display font-bold text-lg text-ink">
            Smart<span className="text-brand-600">Hire</span>
          </span>
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-brand-700 font-medium capitalize">
                {role}
              </span>
              <button
                onClick={handleLogout}
                className="hidden md:inline text-sm text-slate-500 hover:text-ink"
              >
                Logout
              </button>
              {/* Mobile hamburger — only shown when logged in, since that's when there are nav links to hide */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                className="md:hidden w-9 h-9 grid place-items-center text-ink"
              >
                {menuOpen ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                  </svg>
                )}
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

      {/* Mobile dropdown menu */}
      {user && menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass}
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm font-medium text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
