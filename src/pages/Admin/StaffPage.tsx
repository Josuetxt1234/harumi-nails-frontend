import { UsersManagementView } from '../../components/features/users/UsersManagementView';
import { SYSTEM_ROLES } from '../../constants/roles.constants';

export function AdminStaffPage() {
  return (
    <UsersManagementView
      title="Staff Management"
      subtitle="Manage manicurists and salon staff access."
      listTitle="Staff List"
      createLabel="Add Manicurist"
      searchPlaceholder="Search staff by name or email..."
      fixedRole={SYSTEM_ROLES.MESA}
      showRoleFilter={false}
      showDeleteAction={false}
      allowedRoles={[SYSTEM_ROLES.MESA]}
    />
  );
}
