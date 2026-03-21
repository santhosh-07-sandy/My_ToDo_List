import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserService } from './UserService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const loggedInUser = UserService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = (userData) => {
    const newUser = UserService.signup(userData);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    UserService.logout();
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading GrowthPath...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
