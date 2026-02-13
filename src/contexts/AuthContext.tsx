import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeAuth, verifyPassword, updateAuth } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => void;
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [authConfig, setAuthConfig] = useState(initializeAuth());

  // Check if user was previously logged in
  useEffect(() => {
    const sessionToken = sessionStorage.getItem('sessionToken');
    if (sessionToken) {
      setIsAuthenticated(true);
      setUsername(authConfig.username);
    }

    // Check if accessing via guest link
    const params = new URLSearchParams(window.location.search);
    if (params.get('guest') === 'true') {
      setIsGuest(true);
    }
  }, [authConfig.username]);

  const login = (inputUsername: string, password: string): boolean => {
    if (inputUsername === authConfig.username && verifyPassword(password, authConfig.passwordHash)) {
      setIsAuthenticated(true);
      setUsername(inputUsername);
      sessionStorage.setItem('sessionToken', `token-${Date.now()}`);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    sessionStorage.removeItem('sessionToken');
  };

  const changePassword = (newPassword: string) => {
    updateAuth(authConfig.username, newPassword);
    setAuthConfig(initializeAuth());
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        login,
        logout,
        changePassword,
        isGuest,
        setIsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
