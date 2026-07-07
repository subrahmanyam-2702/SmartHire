export const isCandidate = (role) => role === 'candidate';
export const isRecruiter = (role) => role === 'recruiter';
export const isAdmin = (role) => role === 'admin';

export function homeRouteForRole(role) {
  if (role === 'recruiter') return '/recruiter';
  if (role === 'admin') return '/admin';
  return '/candidate';
}
