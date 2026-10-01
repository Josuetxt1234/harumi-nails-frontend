import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDefaultRouteForRoles } from '../lib/get-default-route';

export function DashboardRedirectPage() {
  const { user } = useAuth();

  return <Navigate to={getDefaultRouteForRoles(user?.roles ?? [], user?.permissions)} replace />;
}
