import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDefaultRouteForRoles } from '../../lib/get-default-route';

export function GuestRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-slate-body">
        Restoring your session...
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Navigate to={getDefaultRouteForRoles(user.roles, user.permissions)} replace />
    );
  }

  return <Outlet />;
}
