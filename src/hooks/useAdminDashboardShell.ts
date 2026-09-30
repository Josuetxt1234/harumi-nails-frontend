import { useMemo } from 'react';
import { SYSTEM_ROLES } from '../constants/roles.constants';
import {
  ADMIN_SHELL,
  DashboardShellConfig,
  SUPER_ADMIN_SHELL,
} from '../constants/navigation.constants';
import { useAuth } from '../context/AuthContext';

export function useAdminDashboardShell(): DashboardShellConfig {
  const { user } = useAuth();

  return useMemo(() => {
    if (user?.roles?.includes(SYSTEM_ROLES.SUPER_ADMIN)) {
      return SUPER_ADMIN_SHELL;
    }

    return ADMIN_SHELL;
  }, [user?.roles]);
}
