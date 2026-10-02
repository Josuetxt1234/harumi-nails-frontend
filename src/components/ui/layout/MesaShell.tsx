import { ReactNode } from 'react';
import { DashboardShellConfig } from '../../../constants/navigation.constants';
import { DashboardShell } from './DashboardShell';

interface MesaShellProps {
  children: ReactNode;
  config: DashboardShellConfig;
  sessionLabel?: string;
}

export function MesaShell({ children, config, sessionLabel }: MesaShellProps) {
  return (
    <DashboardShell config={config} sessionLabel={sessionLabel}>
      {children}
    </DashboardShell>
  );
}
