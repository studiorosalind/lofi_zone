import { isElectron } from '../platform';
import { AuthRepository } from './types';
import { DesktopAuthRepository } from './desktop-auth-repository';
import { WebAuthRepository } from './web-auth-repository';
import { MockAuthRepository } from './mock-auth-repository';

/**
 * Factory for creating the appropriate AuthRepository implementation
 * based on the current platform and environment
 */
export class AuthRepositoryFactory {
  /**
   * Create an AuthRepository instance
   * @param useMock Whether to use the mock implementation (for development/testing)
   * @returns An AuthRepository implementation
   */
  static create(useMock = false): AuthRepository {
    // If mock is requested, return the mock implementation
    if (useMock) {
      console.log('🧪 Using mock AuthRepository');
      return new MockAuthRepository();
    }

    // Otherwise, return the appropriate implementation based on the platform
    if (isElectron()) {
      console.log('🖥️ Using desktop AuthRepository');
      return new DesktopAuthRepository();
    } else {
      console.log('🌐 Using web AuthRepository');
      return new WebAuthRepository();
    }
  }
}
