import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDefaultRouteForRoles } from '../../lib/get-default-route';

interface PermissionRouteProps {
  anyOf: string[];
}

export function PermissionRoute({ anyOf }: PermissionRouteProps) {
  const { user, isAuthenticated, isLoading, hasAnyPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm text-slate-body">
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAnyPermission(anyOf)) {
    return (
      <Navigate
        to={getDefaultRouteForRoles(user?.roles ?? [], user?.permissions)}
        replace
      />
    );
  }

  return <Outlet />;
}
