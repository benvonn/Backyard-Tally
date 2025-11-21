import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (userProfile) {
      setUser(userProfile);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userProfile", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userProfile");
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("userProfile", JSON.stringify(updatedUser));
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isLoggedIn,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}