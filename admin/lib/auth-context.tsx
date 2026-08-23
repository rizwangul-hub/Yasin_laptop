'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminApiClient } from './api-client';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem('yasin_admin_token');
    const storedUser = localStorage.getItem('yasin_admin_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('yasin_admin_token');
        localStorage.removeItem('yasin_admin_user');
      }
    } else if (pathname !== '/login') {
      router.push('/login');
    }
    setIsLoading(false);
  }, [pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const res = await adminApiClient<{ token: string; user: AdminUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('yasin_admin_token', res.data.token);
        localStorage.setItem('yasin_admin_user', JSON.stringify(res.data.user));
        return { success: true, message: 'Authentication successful' };
      }

      return { success: false, message: res.message || 'Invalid credentials' };
    } catch (err) {
      return { success: false, message: 'Failed to authenticate with server' };
    }
  };

  const logout = () => {
    adminApiClient('/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    setToken(null);
    localStorage.removeItem('yasin_admin_token');
    localStorage.removeItem('yasin_admin_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
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
