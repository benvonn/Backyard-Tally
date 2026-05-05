import React, { createContext, useContext, useState, useEffect } from 'react';
import isValidOfflineToken from '../user-profile/ValidToken';

interface UserProfile {
  name: string;
  [key: string]: any;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (userData: UserProfile, token: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuthStatus = (): UserProfile | null => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "null");
    const offlineToken = localStorage.getItem("offlineToken");

    if (userProfile && offlineToken && isValidOfflineToken(offlineToken)) {
      return userProfile;
    }

    localStorage.removeItem("userProfile");
    localStorage.removeItem("offlineToken");
    return null;
  };

  const login = (userData: UserProfile, token: string) => {
    setUser(userData);
    localStorage.setItem("userProfile", JSON.stringify(userData));
    localStorage.setItem("offlineToken", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userProfile");
    localStorage.removeItem("offlineToken");
  };

  useEffect(() => {
    const user = checkAuthStatus();
    setUser(user);
    setLoading(false);
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoggedIn: () => user !== null,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}