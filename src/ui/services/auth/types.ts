/**
 * User model based on the database schema
 */
export interface User {
  lofi_zone_user_id: number;
  user_name: string;
  user_profile_pic?: string;
  user_credential_id?: string;
  user_credential_code?: string;
  user_uuid: string;
}

/**
 * Session information returned from authentication
 */
export interface SessionInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp in milliseconds
  user: User;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup credentials
 */
export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

/**
 * Authentication repository interface
 */
export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<SessionInfo>;
  signup(credentials: SignupCredentials): Promise<SessionInfo>;
  refreshSession(refreshToken: string): Promise<SessionInfo>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<SessionInfo | null>;
}
