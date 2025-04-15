import { AuthRepository, LoginCredentials, SessionInfo, SignupCredentials } from './types';

/**
 * Desktop implementation of AuthRepository
 * Uses Electron's IPC to communicate with the main process
 * and localStorage for access tokens
 */
export class DesktopAuthRepository implements AuthRepository {
  private static ACCESS_TOKEN_STORAGE_KEY = 'lofi_zone_access_token';
  private static API_BASE_URL = '/api'; // This would be configured based on environment

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<SessionInfo> {
    try {
      // First, try to use the remote API
      const response = await fetch(`${DesktopAuthRepository.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const sessionInfo = await response.json();
        this.saveAccessToken(sessionInfo.accessToken, sessionInfo.expiresAt);
        
        // Also save to electron store via IPC
        if (window.electronAPI) {
          await window.electronAPI.setUserSession(JSON.stringify({
            refreshToken: sessionInfo.refreshToken,
            user: sessionInfo.user,
          }));
        }
        
        return sessionInfo;
      }
      
      throw new Error(`Login failed: ${response.statusText}`);
    } catch (error) {
      console.error('Remote login failed, falling back to local:', error);
      
      // Fallback to local authentication if remote fails
      if (window.electronAPI) {
        const localUser = await window.electronAPI.getUserSession();
        
        if (localUser) {
          // Create a session with the local user
          const session: SessionInfo = {
            accessToken: `local-access-token-${Math.random().toString(36).substring(2, 15)}`,
            refreshToken: `local-refresh-token-${Math.random().toString(36).substring(2, 15)}`,
            expiresAt: Date.now() + (15 * 60 * 1000), // 15 minutes
            user: {
              lofi_zone_user_id: localUser.id,
              user_name: localUser.username,
              user_uuid: `local-${localUser.id}`,
              user_credential_id: localUser.email,
            },
          };
          
          this.saveAccessToken(session.accessToken, session.expiresAt);
          return session;
        }
      }
      
      throw new Error('Login failed: Unable to authenticate');
    }
  }

  /**
   * Sign up with email and password
   */
  async signup(credentials: SignupCredentials): Promise<SessionInfo> {
    try {
      // First, try to use the remote API
      const response = await fetch(`${DesktopAuthRepository.API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const sessionInfo = await response.json();
        this.saveAccessToken(sessionInfo.accessToken, sessionInfo.expiresAt);
        
        // Also save to electron store via IPC
        if (window.electronAPI) {
          await window.electronAPI.setUserSession(JSON.stringify({
            refreshToken: sessionInfo.refreshToken,
            user: sessionInfo.user,
          }));
        }
        
        return sessionInfo;
      }
      
      throw new Error(`Signup failed: ${response.statusText}`);
    } catch (error) {
      console.error('Remote signup failed:', error);
      throw new Error('Signup failed: Unable to create account');
    }
  }

  /**
   * Refresh the session using the refresh token
   */
  async refreshSession(refreshToken: string): Promise<SessionInfo> {
    try {
      // First, try to use the remote API
      const response = await fetch(`${DesktopAuthRepository.API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const sessionInfo = await response.json();
        this.saveAccessToken(sessionInfo.accessToken, sessionInfo.expiresAt);
        return sessionInfo;
      }
      
      throw new Error(`Token refresh failed: ${response.statusText}`);
    } catch (error) {
      console.error('Remote token refresh failed, falling back to local:', error);
      
      // Fallback to local refresh if remote fails
      if (window.electronAPI) {
        const localUser = await window.electronAPI.getUserSession();
        
        if (localUser) {
          // Create a new session with the local user
          const session: SessionInfo = {
            accessToken: `local-access-token-${Math.random().toString(36).substring(2, 15)}`,
            refreshToken: `local-refresh-token-${Math.random().toString(36).substring(2, 15)}`,
            expiresAt: Date.now() + (15 * 60 * 1000), // 15 minutes
            user: {
              lofi_zone_user_id: localUser.id,
              user_name: localUser.username,
              user_uuid: `local-${localUser.id}`,
              user_credential_id: localUser.email,
            },
          };
          
          this.saveAccessToken(session.accessToken, session.expiresAt);
          return session;
        }
      }
      
      throw new Error('Token refresh failed: Unable to refresh session');
    }
  }

  /**
   * Logout the user
   */
  async logout(): Promise<void> {
    // Clear the access token from localStorage
    localStorage.removeItem(DesktopAuthRepository.ACCESS_TOKEN_STORAGE_KEY);
    
    try {
      // Try to call the remote logout endpoint
      await fetch(`${DesktopAuthRepository.API_BASE_URL}/auth/logout`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Remote logout failed:', error);
    }
    
    // Clear the local session via IPC
    if (window.electronAPI) {
      try {
        await window.electronAPI.setUserSession('');
      } catch (error) {
        console.error('Failed to clear local session:', error);
      }
    }
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
        // For now, we'll just create a new session since we don't have a proper refresh token mechanism
        if (window.electronAPI) {
          const localUser = await window.electronAPI.getUserSession();
          if (localUser) {
            // Create a new session with the local user
            return await this.refreshSession('mock-refresh-token');
          }
        }
        
        // If we can't get the refresh token, return null
        return null;
      } catch (error) {
        console.error('Failed to refresh session:', error);
        return null;
      }
    }
    
    // Try to get the user profile from the remote API
    try {
      const response = await fetch(`${DesktopAuthRepository.API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${tokenData.token}`,
        },
      });
      
      if (response.ok) {
        const user = await response.json();
        
        return {
          accessToken: tokenData.token,
          refreshToken: '', // We don't have access to the refresh token on the client
          expiresAt: tokenData.expiresAt,
          user,
        };
      }
    } catch (error) {
      console.error('Failed to get user profile from remote API:', error);
    }
    
    // Fallback to local user if remote fails
    if (window.electronAPI) {
      try {
        const localUser = await window.electronAPI.getUserSession();
        
        if (localUser) {
          return {
            accessToken: tokenData.token,
            refreshToken: '',
            expiresAt: tokenData.expiresAt,
            user: {
              lofi_zone_user_id: localUser.id,
              user_name: localUser.username,
              user_uuid: `local-${localUser.id}`,
              user_credential_id: localUser.email,
            },
          };
        }
      } catch (error) {
        console.error('Failed to get local user:', error);
      }
    }
    
    return null;
  }

  /**
   * Save the access token to localStorage
   */
  private saveAccessToken(token: string, expiresAt: number): void {
    localStorage.setItem(
      DesktopAuthRepository.ACCESS_TOKEN_STORAGE_KEY,
      JSON.stringify({ token, expiresAt })
    );
  }

  /**
   * Get the stored access token from localStorage
   */
  private getStoredAccessToken(): { token: string; expiresAt: number } | null {
    const tokenJson = localStorage.getItem(DesktopAuthRepository.ACCESS_TOKEN_STORAGE_KEY);
    return tokenJson ? JSON.parse(tokenJson) : null;
  }
}
