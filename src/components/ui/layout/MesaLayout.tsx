import { Outlet, useLocation } from 'react-router-dom';
import { MESA_SHELL } from '../../../constants/navigation.constants';
import { useAuth } from '../../../context/AuthContext';
import { RouteErrorBoundary } from '../feedback/RouteErrorBoundary';
import { MesaShell } from './MesaShell';
import { PageContent } from './PageContent';

export function MesaLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const sessionLabel = user
    ? `Mesa — ${user.firstName} ${user.lastName}`
    : undefined;
  const resetKey = `${location.pathname}${location.search}`;

  return (
    <MesaShell config={MESA_SHELL} sessionLabel={sessionLabel}>
      <PageContent>
        <RouteErrorBoundary resetKey={resetKey}>
          <Outlet />
        </RouteErrorBoundary>
      </PageContent>
    </MesaShell>
  );
}
