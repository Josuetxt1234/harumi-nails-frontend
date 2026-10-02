import { UsersManagementView } from '../../components/features/users/UsersManagementView';
import { SYSTEM_ROLES } from '../../constants/roles.constants';
import { useTranslation } from 'react-i18next';

export function AdminStaffPage() {
  const { t } = useTranslation('users');

  return (
    <UsersManagementView
      title={t('staff_title')}
      subtitle={t('staff_subtitle')}
      listTitle={t('staff_list')}
      createLabel={t('add_manicurist')}
      searchPlaceholder={t('search_staff')}
      fixedRole={SYSTEM_ROLES.MESA}
      showRoleFilter={false}
      showDeleteAction={false}
      allowedRoles={[SYSTEM_ROLES.MESA]}
    />
  );
}
