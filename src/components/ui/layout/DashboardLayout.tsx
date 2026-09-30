import { Outlet, useLocation } from 'react-router-dom';
import { RouteErrorBoundary } from '../feedback/RouteErrorBoundary';
import { useAdminDashboardShell } from '../../../hooks/useAdminDashboardShell';
import { DashboardShell } from './DashboardShell';
import { PageContent } from './PageContent';

export function DashboardLayout() {
  const shellConfig = useAdminDashboardShell();
  const location = useLocation();
  const resetKey = `${location.pathname}${location.search}`;

  return (
    <DashboardShell config={shellConfig}>
      <PageContent>
        <RouteErrorBoundary resetKey={resetKey}>
          <Outlet />
        </RouteErrorBoundary>
      </PageContent>
    </DashboardShell>
  );
}
