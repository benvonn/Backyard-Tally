// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import isValidOfflineToken from '../user-profile/ValidToken';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ New: Check auth status (validates token)
  const checkAuthStatus = () => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    const offlineToken = localStorage.getItem("offlineToken");

    if (userProfile && offlineToken && isValidOfflineToken(offlineToken)) {
      return userProfile;
    }
    
    // Clean up invalid session
    localStorage.removeItem("userProfile");
    localStorage.removeItem("offlineToken");
    return null;
  };

  // ✅ New: Login method that updates context AND localStorage
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("userProfile", JSON.stringify(userData));
    localStorage.setItem("offlineToken", token);
  };

  // ✅ New: Logout method
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userProfile");
    localStorage.removeItem("offlineToken");
  };

  // Check auth on mount
  useEffect(() => {
    const user = checkAuthStatus();
    setUser(user);
    setLoading(false);
  }, []);

  const value = {
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