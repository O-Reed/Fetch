import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/services/api";

// Simple auth context type
interface AuthContextType {
  isAuthenticated: boolean | null;
  userName: string | null;
  userEmail: string | null;
  isLoading: boolean;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const storedName = localStorage.getItem("user-name");
    const storedEmail = localStorage.getItem("user-email");

    if (storedName && storedEmail) {
      setUserName(storedName);
      setUserEmail(storedEmail);
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async (name: string, email: string) => {
    setIsLoading(true);

    try {
      await authApi.login({ name, email });

      // Update local storage
      localStorage.setItem("user-name", name);
      localStorage.setItem("user-email", email);

      // Small delay to ensure the cookie is properly set before updating state
      // This helps prevent race conditions with API calls that depend on authentication
      await new Promise(resolve => setTimeout(resolve, 300));

      // Update state
      setUserName(name);
      setUserEmail(email);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);

    try {
      await authApi.logout();

      // Clear local storage
      localStorage.removeItem("user-name");
      localStorage.removeItem("user-email");

      // Update state
      setUserName(null);
      setUserEmail(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value: AuthContextType = {
    isAuthenticated,
    userName,
    userEmail,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
