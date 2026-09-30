import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  restoreSession,
} from '../services/auth.service';
import type { AuthUser, LoginPayload } from '../types/auth.types';
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '../lib/has-permission';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<AuthUser | null>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      try {
        const restoredSession = await restoreSession();

        if (!restoredSession) {
          return;
        }

        const profile = await getCurrentUser();

        if (isMounted) {
          setUser(profile);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await loginRequest(payload);
    setUser(response.user);
    return response.user;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getCurrentUser();
      setUser(profile);
      return profile;
    } catch {
      return null;
    }
  }, []);

  const checkPermission = useCallback(
    (permission: string) => hasPermission(user?.permissions, permission),
    [user?.permissions],
  );

  const checkAnyPermission = useCallback(
    (permissions: string[]) => hasAnyPermission(user?.permissions, permissions),
    [user?.permissions],
  );

  const checkAllPermissions = useCallback(
    (permissions: string[]) => hasAllPermissions(user?.permissions, permissions),
    [user?.permissions],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshProfile,
      hasPermission: checkPermission,
      hasAnyPermission: checkAnyPermission,
      hasAllPermissions: checkAllPermissions,
    }),
    [
      user,
      isLoading,
      login,
      logout,
      refreshProfile,
      checkPermission,
      checkAnyPermission,
      checkAllPermissions,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
