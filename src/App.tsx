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
import { LegacyRegistersRedirect } from './pages/Admin/LegacyRegistersRedirect';
import { LoginPage } from './pages/Auth/LoginPage';
import { DashboardRedirectPage } from './pages/DashboardRedirectPage';
import { DashboardUsersPage } from './pages/Dashboard/UsersPage';
import { LegacyRolePermissionsRedirect } from './pages/Dashboard/LegacyRolePermissionsRedirect';
import { MesaDailyRegisterPage } from './pages/Mesa/DailyRegisterPage';
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
            </Route>
            <Route element={<PermissionRoute anyOf={ROLES_MODULE_PERMISSIONS} />}>
              <Route
                path="/dashboard/roles"
                element={<LegacyRolePermissionsRedirect />}
              />
            </Route>
            <Route
              element={
                <PermissionRoute anyOf={DAILY_REGISTER_MODULE_PERMISSIONS} />
              }
            >
              <Route
                path="/dashboard/registros"
                element={
                  <LegacyRegistersRedirect targetPath="/dashboard/registro-diario" />
                }
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
            </Route>
            <Route
              element={
                <PermissionRoute anyOf={DAILY_REGISTER_MODULE_PERMISSIONS} />
              }
            >
              <Route
                path="/admin/registros"
                element={
                  <LegacyRegistersRedirect targetPath="/admin/registro-diario" />
                }
              />
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
