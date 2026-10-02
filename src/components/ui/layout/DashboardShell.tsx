import { ReactNode, useState } from 'react';
import { DashboardShellConfig } from '../../../constants/navigation.constants';
import { useTranslation } from 'react-i18next';
import { DashboardSidebar } from './DashboardSidebar';
import { MobileAppBar } from './MobileAppBar';
import { MobileNavDrawer } from './MobileNavDrawer';

interface DashboardShellProps {
  children: ReactNode;
  config: DashboardShellConfig;
  sessionLabel?: string;
}

export function DashboardShell({
  children,
  config,
  sessionLabel,
}: DashboardShellProps) {
  const { t } = useTranslation('nav');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen h-auto overflow-y-auto bg-[#F8FAFC] lg:h-screen lg:overflow-hidden">
      <DashboardSidebar
        brandIcon={config.brandIcon}
        brandSubtitleKey={config.brandSubtitleKey}
        roleLabelKey={config.roleLabelKey}
        navItems={config.navItems}
        sessionLabel={sessionLabel}
        className="hidden md:sticky md:top-0 md:flex md:h-screen"
      />
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        brandIcon={config.brandIcon}
        brandSubtitleKey={config.brandSubtitleKey}
        roleLabelKey={config.roleLabelKey}
        navItems={config.navItems}
        sessionLabel={sessionLabel}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto lg:min-h-0 lg:overflow-hidden">
        <MobileAppBar
          onMenuClick={() => setIsMobileNavOpen(true)}
          brandSubtitle={t(config.brandSubtitleKey)}
        />
        <main className="flex flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:min-h-0 lg:overflow-hidden lg:px-10 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
