// ─────────────────────────────────────────────────────────────
// Auth & User types
// ─────────────────────────────────────────────────────────────

import type { Timestamped } from './common.types';

export type UserRole = 'admin' | 'talent_acquisition' | 'hiring_manager' | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User extends Timestamped {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string; // computed: `${firstName} ${lastName}`
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  department?: string;
  lastLoginAt: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO-8601
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}
