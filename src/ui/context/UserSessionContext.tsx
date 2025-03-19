import { createContext, useState, useEffect, useContext } from "react";

// ✅ Define User Interface
interface User {
  id: number;
  username: string;
  email: string;
  last_login: string;
}

// ✅ Define Context Type
interface UserSessionContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// ✅ Create Context
const UserSessionContext = createContext<UserSessionContextType | undefined>(undefined);

// ✅ Provider Component
export const UserSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getUserSession().then(setUser).catch(console.error);
    } else {
      console.error("❌ electronAPI is not available! Ensure preload.ts is correctly loaded.");
    }
  }, []);

  return (
    <UserSessionContext.Provider value={{ user, setUser }}>
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
