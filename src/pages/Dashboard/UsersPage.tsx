import { RolePermissionsView } from '../../components/features/roles/RolePermissionsView';
import { UsersManagementView } from '../../components/features/users/UsersManagementView';
import { ModulePage } from '../../components/ui/layout/ModulePage';
import { PERMISSIONS } from '../../constants/permissions.constants';
import { useAuth } from '../../context/AuthContext';
import { useModuleTab } from '../../hooks/useModuleTab';
import { useTranslation } from 'react-i18next';

export function DashboardUsersPage() {
  const { t } = useTranslation();
  const { hasAnyPermission } = useAuth();
  const canManageUsers = hasAnyPermission([PERMISSIONS.USERS_LIST]);
  const canManageRolePermissions = hasAnyPermission([
    PERMISSIONS.ROLES_LIST,
    PERMISSIONS.ROLES_READ,
    PERMISSIONS.PERMISSIONS_LIST,
    PERMISSIONS.PERMISSIONS_ASSIGN_TO_ROLE,
  ]);

  const tabs = [
    ...(canManageUsers ? [{ id: 'users', label: t('users:title') }] : []),
    ...(canManageRolePermissions
      ? [{ id: 'permissions', label: t('users:permissions_tab') }]
      : []),
  ];
  const tabIds = tabs.map((tab) => tab.id);
  const defaultTab = tabIds[0] ?? 'users';
  const { activeTab, setActiveTab } = useModuleTab(tabIds, defaultTab);

  return (
    <ModulePage
      title={t('users:title')}
      subtitle={t('users:subtitle')}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabPanels={{
        users: canManageUsers ? (
          <UsersManagementView
            showHeader={false}
            title={t('users:title')}
            subtitle={t('users:subtitle')}
            searchPlaceholder={t('users:search_placeholder')}
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
