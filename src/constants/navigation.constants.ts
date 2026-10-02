import {
  Banknote,
  CalendarDays,
  ClipboardList,
  LucideIcon,
  Sparkles,
  Users,
  Wallet,
  Warehouse,
} from 'lucide-react';
import { PERMISSIONS } from './permissions.constants';

const DAILY_REGISTER_NAV_PERMISSIONS = [
  PERMISSIONS.DAILY_REGISTERS_CREATE,
  PERMISSIONS.DAILY_REGISTERS_LIST,
  PERMISSIONS.SERVICES_LIST,
];

export interface NavItem {
  labelKey: string;
  path: string;
  icon: LucideIcon;
  requiredAnyPermission?: string[];
}

export interface DashboardShellConfig {
  brandIcon: LucideIcon;
  brandSubtitleKey: string;
  roleLabelKey: string;
  navItems: NavItem[];
}

export const SUPER_ADMIN_SHELL: DashboardShellConfig = {
  brandIcon: Sparkles,
  brandSubtitleKey: 'brand_premium',
  roleLabelKey: 'role_super_admin',
  navItems: [
    {
      labelKey: 'pos',
      path: '/dashboard/registro-diario',
      icon: ClipboardList,
      requiredAnyPermission: DAILY_REGISTER_NAV_PERMISSIONS,
    },
    {
      labelKey: 'users',
      path: '/dashboard/users',
      icon: Users,
      requiredAnyPermission: [PERMISSIONS.USERS_LIST],
    },
    {
      labelKey: 'services',
      path: '/dashboard/servicios',
      icon: Sparkles,
      requiredAnyPermission: [PERMISSIONS.SERVICES_LIST],
    },
    {
      labelKey: 'vouchers',
      path: '/dashboard/vales',
      icon: Wallet,
      requiredAnyPermission: [PERMISSIONS.ADVANCES_LIST],
    },
    {
      labelKey: 'payroll',
      path: '/dashboard/nomina',
      icon: Banknote,
      requiredAnyPermission: [PERMISSIONS.PAYROLL_LIST, PERMISSIONS.PAYROLL_CREATE],
    },
    {
      labelKey: 'inventory',
      path: '/dashboard/inventario',
      icon: Warehouse,
      requiredAnyPermission: [PERMISSIONS.INVENTORY_LIST],
    },
  ],
};

export const ADMIN_SHELL: DashboardShellConfig = {
  brandIcon: CalendarDays,
  brandSubtitleKey: 'brand_admin',
  roleLabelKey: 'role_admin',
  navItems: [
    {
      labelKey: 'pos',
      path: '/admin/registro-diario',
      icon: ClipboardList,
      requiredAnyPermission: DAILY_REGISTER_NAV_PERMISSIONS,
    },
    {
      labelKey: 'staff',
      path: '/admin/staff',
      icon: Users,
      requiredAnyPermission: [PERMISSIONS.USERS_LIST],
    },
    {
      labelKey: 'services',
      path: '/admin/servicios',
      icon: Sparkles,
      requiredAnyPermission: [PERMISSIONS.SERVICES_LIST],
    },
    {
      labelKey: 'vouchers',
      path: '/admin/vales',
      icon: Wallet,
      requiredAnyPermission: [PERMISSIONS.ADVANCES_LIST],
    },
    {
      labelKey: 'payroll',
      path: '/admin/nomina',
      icon: Banknote,
      requiredAnyPermission: [PERMISSIONS.PAYROLL_LIST, PERMISSIONS.PAYROLL_CREATE],
    },
    {
      labelKey: 'inventory',
      path: '/admin/inventario',
      icon: Warehouse,
      requiredAnyPermission: [PERMISSIONS.INVENTORY_LIST],
    },
  ],
};

export const MESA_SHELL: DashboardShellConfig = {
  brandIcon: Sparkles,
  brandSubtitleKey: 'brand_mesa',
  roleLabelKey: 'role_mesa',
  navItems: [
    {
      labelKey: 'pos',
      path: '/mesa/registro-diario',
      icon: ClipboardList,
      requiredAnyPermission: DAILY_REGISTER_NAV_PERMISSIONS,
    },
    {
      labelKey: 'inventory',
      path: '/mesa/inventario',
      icon: Warehouse,
      requiredAnyPermission: [PERMISSIONS.INVENTORY_LIST],
    },
  ],
};
