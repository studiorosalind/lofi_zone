import { AuthRepository, LoginCredentials, SessionInfo, SignupCredentials } from './types';

/**
 * Web implementation of AuthRepository
 * Uses HTTP-only cookies for refresh tokens and localStorage for access tokens
 */
export class WebAuthRepository implements AuthRepository {
  private static ACCESS_TOKEN_STORAGE_KEY = 'lofi_zone_access_token';
  private static API_BASE_URL = '/api'; // This would be configured based on environment

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<SessionInfo> {
    const response = await fetch(`${WebAuthRepository.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const sessionInfo = await response.json();
    this.saveAccessToken(sessionInfo.accessToken, sessionInfo.expiresAt);
    
    return sessionInfo;
  }

  /**
   * Sign up with email and password
   */
  async signup(credentials: SignupCredentials): Promise<SessionInfo> {
    const response = await fetch(`${WebAuthRepository.API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      throw new Error(`Signup failed: ${response.statusText}`);
    }

    const sessionInfo = await response.json();
    this.saveAccessToken(sessionInfo.accessToken, sessionInfo.expiresAt);
    
    return sessionInfo;
  }

  /**
   * Refresh the session using the refresh token (stored in HTTP-only cookie)
   */
  async refreshSession(refreshToken: string): Promise<SessionInfo> {
    // Note: refreshToken parameter is not used in web implementation
    // because it's automatically sent in the cookie
    const response = await fetch(`${WebAuthRepository.API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const sessionInfo = await response.json();
    this.saveAccessToken(sessionInfo.accessToken, sessionInfo.expiresAt);
    
    return sessionInfo;
  }

  /**
   * Logout the user
   */
  async logout(): Promise<void> {
    // Clear the access token from localStorage
    localStorage.removeItem(WebAuthRepository.ACCESS_TOKEN_STORAGE_KEY);
    
    // Call the logout endpoint to clear the refresh token cookie
    await fetch(`${WebAuthRepository.API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  }

  /**
   * Get the current session if it exists
   */
  async getCurrentSession(): Promise<SessionInfo | null> {
    const tokenData = this.getStoredAccessToken();
    
    if (!tokenData) {
      return null;
    }
    
    // Check if the token has expired
    if (tokenData.expiresAt < Date.now()) {
      try {
        // Try to refresh the token
        return await this.refreshSession('');
      } catch (error) {
        console.error('Failed to refresh session:', error);
        return null;
      }
    }
    
    // Fetch the user profile with the access token
    try {
      const response = await fetch(`${WebAuthRepository.API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${tokenData.token}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get user profile: ${response.statusText}`);
      }
      
      const user = await response.json();
      
      return {
        accessToken: tokenData.token,
        refreshToken: '', // We don't have access to the refresh token on the client
        expiresAt: tokenData.expiresAt,
        user,
      };
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Save the access token to localStorage
   */
  private saveAccessToken(token: string, expiresAt: number): void {
    localStorage.setItem(
      WebAuthRepository.ACCESS_TOKEN_STORAGE_KEY,
      JSON.stringify({ token, expiresAt })
    );
  }

  /**
   * Get the stored access token from localStorage
   */
  private getStoredAccessToken(): { token: string; expiresAt: number } | null {
    const tokenJson = localStorage.getItem(WebAuthRepository.ACCESS_TOKEN_STORAGE_KEY);
    return tokenJson ? JSON.parse(tokenJson) : null;
  }
}
