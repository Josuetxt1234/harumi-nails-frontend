import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LucideIcon,
  Settings,
  Shield,
  Sparkles,
  UserCircle2,
  Users,
} from 'lucide-react';
import { SYSTEM_ROLES } from './roles.constants';
import { PERMISSIONS } from './permissions.constants';

const DAILY_REGISTER_NAV_PERMISSIONS = [
  PERMISSIONS.DAILY_REGISTERS_CREATE,
  PERMISSIONS.DAILY_REGISTERS_LIST,
  PERMISSIONS.SERVICES_LIST,
];

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  enabled: boolean;
  requiredAnyPermission?: string[];
}

export interface DashboardShellConfig {
  brandIcon: LucideIcon;
  brandSubtitle: string;
  roleLabel: string;
  navItems: NavItem[];
}

export const SUPER_ADMIN_SHELL: DashboardShellConfig = {
  brandIcon: Sparkles,
  brandSubtitle: 'Premium Salon',
  roleLabel: 'Super Admin',
  navItems: [
    {
      label: 'Dashboard',
      path: '/dashboard/overview',
      icon: LayoutDashboard,
      enabled: false,
    },
    {
      label: 'Usuarios',
      path: '/dashboard/users',
      icon: Users,
      enabled: true,
      requiredAnyPermission: [PERMISSIONS.USERS_LIST],
    },
    {
      label: 'Registro diario',
      path: '/dashboard/registro-diario',
      icon: ClipboardList,
      enabled: true,
      requiredAnyPermission: DAILY_REGISTER_NAV_PERMISSIONS,
    },
    {
      label: 'Configuración',
      path: '/dashboard/settings',
      icon: Settings,
      enabled: false,
    },
    {
      label: 'Auditoría',
      path: '/dashboard/audit',
      icon: Shield,
      enabled: false,
    },
  ],
};

export const ADMIN_SHELL: DashboardShellConfig = {
  brandIcon: CalendarDays,
  brandSubtitle: 'Salon Admin',
  roleLabel: 'Admin',
  navItems: [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      enabled: false,
    },
    {
      label: 'Staff',
      path: '/admin/staff',
      icon: Users,
      enabled: true,
      requiredAnyPermission: [PERMISSIONS.USERS_LIST],
    },
    {
      label: 'Registro diario',
      path: '/admin/registro-diario',
      icon: ClipboardList,
      enabled: true,
      requiredAnyPermission: DAILY_REGISTER_NAV_PERMISSIONS,
    },
  ],
};

export const MESA_SHELL: DashboardShellConfig = {
  brandIcon: Sparkles,
  brandSubtitle: 'Estación de trabajo',
  roleLabel: 'Mesa',
  navItems: [
    {
      label: 'Registro diario',
      path: '/mesa/registro-diario',
      icon: ClipboardList,
      enabled: true,
      requiredAnyPermission: DAILY_REGISTER_NAV_PERMISSIONS,
    },
    {
      label: 'Mi perfil',
      path: '/profile',
      icon: UserCircle2,
      enabled: true,
      requiredAnyPermission: [PERMISSIONS.PROFILE_READ],
    },
  ],
};

export function getRoleLabelForShell(roles: string[]): string {
  if (roles.includes(SYSTEM_ROLES.SUPER_ADMIN)) {
    return SUPER_ADMIN_SHELL.roleLabel;
  }

  if (roles.includes(SYSTEM_ROLES.ADMIN)) {
    return ADMIN_SHELL.roleLabel;
  }

  if (roles.includes(SYSTEM_ROLES.MESA)) {
    return MESA_SHELL.roleLabel;
  }

  return 'Staff';
}
