import { ReactNode } from 'react';
import { DashboardShellConfig } from '../../../constants/navigation.constants';
import { DashboardSidebar } from './DashboardSidebar';

interface DashboardShellProps {
  children: ReactNode;
  config: DashboardShellConfig;
}

export function DashboardShell({ children, config }: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <DashboardSidebar
        brandIcon={config.brandIcon}
        brandSubtitle={config.brandSubtitle}
        roleLabel={config.roleLabel}
        navItems={config.navItems}
      />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}
