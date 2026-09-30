import { RolePermissionsView } from '../../components/features/roles/RolePermissionsView';
import { UsersManagementView } from '../../components/features/users/UsersManagementView';
import { ModulePage } from '../../components/ui/layout/ModulePage';
import { useModuleTab } from '../../hooks/useModuleTab';

const USERS_MODULE_TABS = [
  { id: 'users', label: 'Usuarios' },
  { id: 'permissions', label: 'Permisos' },
] as const;

const USERS_MODULE_TAB_IDS = USERS_MODULE_TABS.map((tab) => tab.id);

export function DashboardUsersPage() {
  const { activeTab, setActiveTab } = useModuleTab(
    USERS_MODULE_TAB_IDS,
    'users',
  );

  return (
    <ModulePage
      title="Usuarios"
      subtitle="Administra el equipo del salón y los permisos por rol."
      tabs={[...USERS_MODULE_TABS]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabPanels={{
        users: (
          <UsersManagementView
            showHeader={false}
            title="Usuarios"
            subtitle="Administra el equipo del salón y los permisos por rol."
            searchPlaceholder="Buscar por nombre, correo o rol..."
          />
        ),
        permissions: (
          <RolePermissionsView
            showHeader={false}
            enabled={activeTab === 'permissions'}
          />
        ),
      }}
    />
  );
}
