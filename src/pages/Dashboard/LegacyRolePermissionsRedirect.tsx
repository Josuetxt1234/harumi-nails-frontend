import { Navigate } from 'react-router-dom';

export function LegacyRolePermissionsRedirect() {
  return <Navigate to="/dashboard/users?tab=permissions" replace />;
}
