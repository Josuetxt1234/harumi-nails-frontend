import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminRoute } from './components/auth/AdminRoute';
import { GuestRoute } from './components/auth/GuestRoute';
import { MesaRoute } from './components/auth/MesaRoute';
import { PermissionRoute } from './components/auth/PermissionRoute';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SuperAdminRoute } from './components/auth/SuperAdminRoute';
import { DashboardLayout } from './components/ui/layout/DashboardLayout';
import { MesaLayout } from './components/ui/layout/MesaLayout';
import { PERMISSIONS } from './constants/permissions.constants';
import { AuthProvider } from './context/AuthContext';
import { AdminStaffPage } from './pages/Admin/StaffPage';
import { AdminDailyRegisterPage } from './pages/Admin/DailyRegisterPage';
import { DailyRegistersHistoryPage } from './pages/Admin/RegistersHistoryPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { DashboardRedirectPage } from './pages/DashboardRedirectPage';
import { DashboardUsersPage } from './pages/Dashboard/UsersPage';
import { ServicesManagementPage } from './pages/Dashboard/ServicesPage';
import { LegacyRolePermissionsRedirect } from './pages/Dashboard/LegacyRolePermissionsRedirect';
import { AdvancesManagementPage } from './pages/Admin/AdvancesManagementPage';
import { InventoryManagementPage } from './pages/Admin/InventoryManagementPage';
import { PayrollManagementPage } from './pages/Admin/PayrollManagementPage';
import { MesaAdvancesPage } from './pages/Mesa/AdvancesPage';
import { MesaDailyRegisterPage } from './pages/Mesa/DailyRegisterPage';
import { MesaInventoryPage } from './pages/Mesa/InventoryPage';
import { MesaPayrollPage } from './pages/Mesa/PayrollPage';
import { ProfilePage } from './pages/Profile/ProfilePage';

const USERS_MODULE_PERMISSIONS = [PERMISSIONS.USERS_LIST];
const ROLES_MODULE_PERMISSIONS = [
  PERMISSIONS.ROLES_LIST,
  PERMISSIONS.ROLES_READ,
  PERMISSIONS.PERMISSIONS_LIST,
  PERMISSIONS.PERMISSIONS_ASSIGN_TO_ROLE,
];
const DAILY_REGISTER_MODULE_PERMISSIONS = [
  PERMISSIONS.DAILY_REGISTERS_CREATE,
  PERMISSIONS.DAILY_REGISTERS_LIST,
  PERMISSIONS.SERVICES_LIST,
];
const DAILY_REGISTER_HISTORY_PERMISSIONS = [
  PERMISSIONS.DAILY_REGISTERS_LIST,
  PERMISSIONS.DAILY_REGISTERS_CREATE,
];
const SERVICES_MODULE_PERMISSIONS = [PERMISSIONS.SERVICES_LIST];
const ADVANCES_ADMIN_PERMISSIONS = [
  PERMISSIONS.ADVANCES_LIST,
  PERMISSIONS.ADVANCES_CREATE,
];
const ADVANCES_MESA_PERMISSIONS = [PERMISSIONS.ADVANCES_READ];
const PAYROLL_ADMIN_PERMISSIONS = [
  PERMISSIONS.PAYROLL_LIST,
  PERMISSIONS.PAYROLL_CREATE,
];
const PAYROLL_MESA_PERMISSIONS = [PERMISSIONS.PAYROLL_READ];
const INVENTORY_ADMIN_PERMISSIONS = [
  PERMISSIONS.INVENTORY_LIST,
  PERMISSIONS.INVENTORY_CREATE,
];
const INVENTORY_MESA_PERMISSIONS = [PERMISSIONS.INVENTORY_LIST];

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardRedirectPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route element={<SuperAdminRoute />}>
            <Route element={<DashboardLayout />}>
              <Route element={<PermissionRoute anyOf={USERS_MODULE_PERMISSIONS} />}>
                <Route path="/dashboard/users" element={<DashboardUsersPage />} />
              </Route>
              <Route
                element={
                  <PermissionRoute anyOf={DAILY_REGISTER_MODULE_PERMISSIONS} />
                }
              >
                <Route
                  path="/dashboard/registro-diario"
                  element={<AdminDailyRegisterPage />}
                />
              </Route>
              <Route
                element={
                  <PermissionRoute anyOf={DAILY_REGISTER_HISTORY_PERMISSIONS} />
                }
              >
                <Route
                  path="/dashboard/registros"
                  element={<DailyRegistersHistoryPage />}
                />
              </Route>
              <Route element={<PermissionRoute anyOf={SERVICES_MODULE_PERMISSIONS} />}>
                <Route
                  path="/dashboard/servicios"
                  element={<ServicesManagementPage />}
                />
              </Route>
              <Route element={<PermissionRoute anyOf={ADVANCES_ADMIN_PERMISSIONS} />}>
                <Route
                  path="/dashboard/vales"
                  element={<AdvancesManagementPage />}
                />
              </Route>
              <Route element={<PermissionRoute anyOf={PAYROLL_ADMIN_PERMISSIONS} />}>
                <Route
                  path="/dashboard/nomina"
                  element={<PayrollManagementPage />}
                />
              </Route>
              <Route element={<PermissionRoute anyOf={INVENTORY_ADMIN_PERMISSIONS} />}>
                <Route
                  path="/dashboard/inventario"
                  element={<InventoryManagementPage />}
                />
              </Route>
            </Route>
            <Route element={<PermissionRoute anyOf={ROLES_MODULE_PERMISSIONS} />}>
              <Route
                path="/dashboard/roles"
                element={<LegacyRolePermissionsRedirect />}
              />
            </Route>
          </Route>

          <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout />}>
              <Route element={<PermissionRoute anyOf={USERS_MODULE_PERMISSIONS} />}>
                <Route path="/admin/staff" element={<AdminStaffPage />} />
              </Route>
              <Route
                element={
                  <PermissionRoute anyOf={DAILY_REGISTER_MODULE_PERMISSIONS} />
                }
              >
                <Route
                  path="/admin/registro-diario"
                  element={<AdminDailyRegisterPage />}
                />
              </Route>
              <Route
                element={
                  <PermissionRoute anyOf={DAILY_REGISTER_HISTORY_PERMISSIONS} />
                }
              >
                <Route
                  path="/admin/registros"
                  element={<DailyRegistersHistoryPage />}
                />
              </Route>
              <Route element={<PermissionRoute anyOf={SERVICES_MODULE_PERMISSIONS} />}>
                <Route
                  path="/admin/servicios"
                  element={<ServicesManagementPage />}
                />
              </Route>
              <Route element={<PermissionRoute anyOf={ADVANCES_ADMIN_PERMISSIONS} />}>
                <Route
                  path="/admin/vales"
                  element={<AdvancesManagementPage />}
                />
              </Route>
              <Route element={<PermissionRoute anyOf={PAYROLL_ADMIN_PERMISSIONS} />}>
                <Route
                  path="/admin/nomina"
                  element={<PayrollManagementPage />}
                />
              </Route>
              <Route element={<PermissionRoute anyOf={INVENTORY_ADMIN_PERMISSIONS} />}>
                <Route
                  path="/admin/inventario"
                  element={<InventoryManagementPage />}
                />
              </Route>
            </Route>
          </Route>

          <Route element={<MesaRoute />}>
            <Route element={<MesaLayout />}>
              <Route
                element={
                  <PermissionRoute anyOf={DAILY_REGISTER_MODULE_PERMISSIONS} />
                }
              >
                <Route
                  path="/mesa/registro-diario"
                  element={<MesaDailyRegisterPage />}
                />
              </Route>
              <Route
                element={
                  <PermissionRoute anyOf={DAILY_REGISTER_HISTORY_PERMISSIONS} />
                }
              >
                <Route
                  path="/mesa/registros"
                  element={<DailyRegistersHistoryPage />}
                />
              </Route>
              <Route element={<PermissionRoute anyOf={ADVANCES_MESA_PERMISSIONS} />}>
                <Route path="/mesa/vales" element={<MesaAdvancesPage />} />
              </Route>
              <Route element={<PermissionRoute anyOf={PAYROLL_MESA_PERMISSIONS} />}>
                <Route path="/mesa/nomina" element={<MesaPayrollPage />} />
              </Route>
              <Route element={<PermissionRoute anyOf={INVENTORY_MESA_PERMISSIONS} />}>
                <Route path="/mesa/inventario" element={<MesaInventoryPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
