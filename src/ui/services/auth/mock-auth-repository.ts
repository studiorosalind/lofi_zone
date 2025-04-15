import { AuthRepository, LoginCredentials, SessionInfo, SignupCredentials, User } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Mock implementation of AuthRepository for development and testing
 */
export class MockAuthRepository implements AuthRepository {
  private static SESSION_STORAGE_KEY = 'lofi_zone_session';
  private static ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds

  /**
   * Simulates a login request
   */
  async login(credentials: LoginCredentials): Promise<SessionInfo> {
    console.log('🔐 Mock login with:', credentials.email);
    
    // Simulate API delay
    await this.delay(800);
    
    // Create a mock user
    const user: User = {
      lofi_zone_user_id: 1,
      user_name: credentials.email.split('@')[0],
      user_uuid: uuidv4(),
      user_credential_id: credentials.email,
      user_credential_code: 'password', // In a real app, we would never store passwords like this
    };
    
    const session = this.createSession(user);
    this.saveSession(session);
    
    return session;
  }

  /**
   * Simulates a signup request
   */
  async signup(credentials: SignupCredentials): Promise<SessionInfo> {
    console.log('📝 Mock signup with:', credentials.email);
    
    // Simulate API delay
    await this.delay(1000);
    
    // Create a mock user with a UUID
    const user: User = {
      lofi_zone_user_id: Math.floor(Math.random() * 1000) + 1,
      user_name: credentials.name || credentials.email.split('@')[0],
      user_uuid: uuidv4(),
      user_credential_id: credentials.email,
      user_credential_code: 'password', // In a real app, we would never store passwords like this
    };
    
    const session = this.createSession(user);
    this.saveSession(session);
    
    return session;
  }

  /**
   * Simulates a token refresh
   */
  async refreshSession(refreshToken: string): Promise<SessionInfo> {
    console.log('🔄 Mock refresh token');
    
    // Simulate API delay
    await this.delay(500);
    
    const currentSession = this.getStoredSession();
    if (!currentSession || currentSession.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }
    
    // Create a new session with the same user
    const session = this.createSession(currentSession.user);
    this.saveSession(session);
    
    return session;
  }

  /**
   * Simulates a logout request
   */
  async logout(): Promise<void> {
    console.log('🚪 Mock logout');
    
    // Simulate API delay
    await this.delay(300);
    
    // Clear the session
    localStorage.removeItem(MockAuthRepository.SESSION_STORAGE_KEY);
  }

  /**
   * Gets the current session if it exists and is valid
   */
  async getCurrentSession(): Promise<SessionInfo | null> {
    const session = this.getStoredSession();
    
    if (!session) {
      return null;
    }
    
    // Check if the session has expired
    if (session.expiresAt < Date.now()) {
      console.log('⏰ Session expired, attempting to refresh');
      try {
        return await this.refreshSession(session.refreshToken);
      } catch (error) {
        console.error('Failed to refresh session:', error);
        return null;
      }
    }
    
    return session;
  }

  /**
   * Creates a new session for a user
   */
  private createSession(user: User): SessionInfo {
    return {
      accessToken: `mock-access-token-${Math.random().toString(36).substring(2, 15)}`,
      refreshToken: `mock-refresh-token-${Math.random().toString(36).substring(2, 15)}`,
      expiresAt: Date.now() + MockAuthRepository.ACCESS_TOKEN_EXPIRY,
      user,
    };
  }

  /**
   * Saves the session to localStorage
   */
  private saveSession(session: SessionInfo): void {
    localStorage.setItem(
      MockAuthRepository.SESSION_STORAGE_KEY,
      JSON.stringify(session)
    );
  }

  /**
   * Gets the stored session from localStorage
   */
  private getStoredSession(): SessionInfo | null {
    const sessionJson = localStorage.getItem(MockAuthRepository.SESSION_STORAGE_KEY);
    return sessionJson ? JSON.parse(sessionJson) : null;
  }

  /**
   * Helper method to simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
