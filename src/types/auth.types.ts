export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  roles: string[];
  permissions: string[];
  /** While true the session is held behind the temporary-password gate. */
  mustChangePassword: boolean;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}
