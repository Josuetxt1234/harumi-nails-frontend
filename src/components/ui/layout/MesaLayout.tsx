import { MESA_SHELL } from '../../../constants/navigation.constants';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import { RouteErrorBoundary } from '../feedback/RouteErrorBoundary';
import { DashboardShell } from './DashboardShell';
import { PageContent } from './PageContent';

export function MesaLayout() {
  const { t } = useTranslation('nav');
  const { user } = useAuth();
  const location = useLocation();
  const sessionLabel = user
    ? t('mesa_session', {
        name: `${user.firstName} ${user.lastName}`.trim(),
      })
    : undefined;
  const resetKey = `${location.pathname}${location.search}`;

  return (
    <DashboardShell config={MESA_SHELL} sessionLabel={sessionLabel}>
      <PageContent>
        <RouteErrorBoundary resetKey={resetKey}>
          <Outlet />
        </RouteErrorBoundary>
      </PageContent>
    </DashboardShell>
  );
}
