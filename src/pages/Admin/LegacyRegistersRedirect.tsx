import { Navigate } from 'react-router-dom';

interface LegacyRegistersRedirectProps {
  targetPath: string;
}

export function LegacyRegistersRedirect({
  targetPath,
}: LegacyRegistersRedirectProps) {
  return <Navigate to={`${targetPath}?tab=historial`} replace />;
}
