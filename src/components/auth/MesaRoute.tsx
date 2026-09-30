import { Navigate, Outlet } from 'react-router-dom';
import { SYSTEM_ROLES } from '../../constants/roles.constants';
import { useAuth } from '../../context/AuthContext';
import { getDefaultRouteForRoles } from '../../lib/get-default-route';

export function MesaRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm text-slate-body">
        Cargando sesión...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isMesa = user?.roles?.includes(SYSTEM_ROLES.MESA);
  const isElevated =
    user?.roles?.includes(SYSTEM_ROLES.ADMIN) ||
    user?.roles?.includes(SYSTEM_ROLES.SUPER_ADMIN);

  if (!isMesa && !isElevated) {
    return <Navigate to={getDefaultRouteForRoles(user?.roles ?? [])} replace />;
  }

  return <Outlet />;
}
