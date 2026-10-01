import { RolePermissionsView } from '../../components/features/roles/RolePermissionsView';
import { UsersManagementView } from '../../components/features/users/UsersManagementView';
import { ModulePage } from '../../components/ui/layout/ModulePage';
import { PERMISSIONS } from '../../constants/permissions.constants';
import { useAuth } from '../../context/AuthContext';
import { useModuleTab } from '../../hooks/useModuleTab';

const USERS_TAB = { id: 'users', label: 'Usuarios' } as const;
const PERMISSIONS_TAB = { id: 'permissions', label: 'Permisos' } as const;

export function DashboardUsersPage() {
  const { hasAnyPermission } = useAuth();
  const canManageUsers = hasAnyPermission([PERMISSIONS.USERS_LIST]);
  const canManageRolePermissions = hasAnyPermission([
    PERMISSIONS.ROLES_LIST,
    PERMISSIONS.ROLES_READ,
    PERMISSIONS.PERMISSIONS_LIST,
    PERMISSIONS.PERMISSIONS_ASSIGN_TO_ROLE,
  ]);

  const tabs = [
    ...(canManageUsers ? [USERS_TAB] : []),
    ...(canManageRolePermissions ? [PERMISSIONS_TAB] : []),
  ];
  const tabIds = tabs.map((tab) => tab.id);
  const defaultTab = tabIds[0] ?? USERS_TAB.id;
  const { activeTab, setActiveTab } = useModuleTab(tabIds, defaultTab);

  return (
    <ModulePage
      title="Usuarios"
      subtitle="Administra el equipo del salón y los permisos por rol."
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabPanels={{
        users: canManageUsers ? (
          <UsersManagementView
            showHeader={false}
            title="Usuarios"
            subtitle="Administra el equipo del salón y los permisos por rol."
            searchPlaceholder="Buscar por nombre, correo o rol..."
          />
        ) : null,
        permissions: canManageRolePermissions ? (
          <RolePermissionsView
            showHeader={false}
            enabled={activeTab === 'permissions'}
          />
        ) : null,
      }}
    />
  );
}
