import React, { createContext, useContext, useState, useEffect } from 'react';
import { userProfiles } from '../data/userProfiles.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('spider_sync_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const matched = userProfiles.find(u => u.id === parsed.id);
        if (matched) return matched;
      } catch (e) {}
    }
    return userProfiles[0]; // Default: Peter Parker
  });

  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    localStorage.setItem('spider_sync_auth_user', JSON.stringify({ id: currentUser.id }));
  }, [currentUser]);

  // ID + Password Login Method
  const login = (usernameOrEmail, password) => {
    setAuthError(null);
    const cleanIdentifier = usernameOrEmail.trim().toLowerCase();

    const user = userProfiles.find(u => 
      u.username.toLowerCase() === cleanIdentifier || 
      u.email.toLowerCase() === cleanIdentifier
    );

    if (!user) {
      const err = `User ID "${usernameOrEmail}" not found in delivery registry.`;
      setAuthError(err);
      return { success: false, error: err };
    }

    if (user.password !== password) {
      const err = `Incorrect password for ${user.name}. (Default demo password is: password123)`;
      setAuthError(err);
      return { success: false, error: err };
    }

    setCurrentUser(user);
    return { success: true, user };
  };

  const switchUserDirect = (userId) => {
    const user = userProfiles.find(u => u.id === userId) || userProfiles[0];
    setCurrentUser(user);
    return user;
  };

  const isInternal = currentUser.roleType === 'internal';
  const permissions = currentUser.permissions;

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfiles,
      login,
      switchUserDirect,
      authError,
      setAuthError,
      isInternal,
      permissions
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
