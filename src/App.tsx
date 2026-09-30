import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminRoute } from './components/auth/AdminRoute';
import { GuestRoute } from './components/auth/GuestRoute';
import { MesaRoute } from './components/auth/MesaRoute';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SuperAdminRoute } from './components/auth/SuperAdminRoute';
import { DashboardLayout } from './components/ui/layout/DashboardLayout';
import { MesaLayout } from './components/ui/layout/MesaLayout';
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
              <Route path="/dashboard/users" element={<DashboardUsersPage />} />
              <Route
                path="/dashboard/registro-diario"
                element={<AdminDailyRegisterPage />}
              />
            </Route>
            <Route
              path="/dashboard/roles"
              element={<LegacyRolePermissionsRedirect />}
            />
            <Route
              path="/dashboard/registros"
              element={
                <LegacyRegistersRedirect targetPath="/dashboard/registro-diario" />
              }
            />
          </Route>

          <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/staff" element={<AdminStaffPage />} />
              <Route
                path="/admin/registro-diario"
                element={<AdminDailyRegisterPage />}
              />
            </Route>
            <Route
              path="/admin/registros"
              element={
                <LegacyRegistersRedirect targetPath="/admin/registro-diario" />
              }
            />
          </Route>

          <Route element={<MesaRoute />}>
            <Route element={<MesaLayout />}>
              <Route
                path="/mesa/registro-diario"
                element={<MesaDailyRegisterPage />}
              />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
