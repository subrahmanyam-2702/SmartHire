import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { homeRouteForRole } from '../../utils/roleCheck';

export default function RoleGuard({ allowedRoles }) {
  const { role } = useAuth();
  if (!allowedRoles.includes(role)) {
    return <Navigate to={homeRouteForRole(role)} replace />;
  }
  return <Outlet />;
}
