import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { User, SessionInfo } from "../services/auth/types";
import { AuthRepositoryFactory } from "../services/auth/auth-repository-factory";

// ✅ Define Context Type
interface UserSessionContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ✅ Create Context
const UserSessionContext = createContext<UserSessionContextType | undefined>(undefined);

// ✅ Provider Component
export const UserSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Create the auth repository
  const authRepository = AuthRepositoryFactory.create(true); // Use mock for now
  
  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentSession = await authRepository.getCurrentSession();
        setSession(currentSession);
      } catch (error) {
        console.error("Failed to get current session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Show login modal if not authenticated after initial load
  useEffect(() => {
    if (!isLoading && !session) {
      setShowLoginModal(true);
    }
  }, [isLoading, session]);
  
  // Login handler
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const newSession = await authRepository.login({ email, password });
      setSession(newSession);
      setShowLoginModal(false);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [authRepository]);
  
  // Signup handler
  const signup = useCallback(async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const newSession = await authRepository.signup({ email, password, name });
      setSession(newSession);
      setShowLoginModal(false);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [authRepository]);
  
  // Logout handler
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authRepository.logout();
      setSession(null);
      setShowLoginModal(true);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [authRepository]);

  return (
    <UserSessionContext.Provider 
      value={{ 
        user: session?.user || null,
        isLoading,
        isAuthenticated: !!session,
        showLoginModal,
        setShowLoginModal,
        login,
        signup,
        logout
      }}
    >
      {children}
    </UserSessionContext.Provider>
  );
};

// ✅ Custom Hook for Easier Access
export const useUserSession = () => {
  const context = useContext(UserSessionContext);
  if (!context) throw new Error("useUserSession must be used within a UserSessionProvider");
  return context;
};
