import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser } from '../lib/api-client';

interface User {
  id: string;
  name: string;
  avatar: string;
  isPro?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token (Mock check)
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchCurrentUser()
        .then((userData: any) => setUser(userData)) // Use mock data
        .catch(() => localStorage.removeItem('auth_token'))
        .finally(() => setIsLoading(false));
    } else {
      // For Demo: Auto-login as Guest/Default User if no token, 
      // but strictly we should start as null.
      // To keep current flow working, we simulate a session.
      fetchCurrentUser()
        .then((userData: any) => setUser(userData))
        .finally(() => setIsLoading(false));
    }
  }, []);

  const login = async () => {
    setIsLoading(true);
    // Simulate API Login
    await new Promise(resolve => setTimeout(resolve, 800));
    localStorage.setItem('auth_token', 'mock_token_123');
    const userData = await fetchCurrentUser();
    setUser(userData as any);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    // Optional: Redirect to landing
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
