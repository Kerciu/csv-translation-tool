'use client';

import type React from 'react';

import { useState, createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  provider?: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          if (email && password.length >= 6) {
            const newUser = {
              id: Math.random().toString(36).substring(2, 9),
              name: email.split('@')[0],
              email,
            };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            document.cookie = `user_session=true; path=/; max-age=${60 * 60 * 24 * 7}`;
            resolve();
            router.push('/dashboard');
          } else {
            reject(new Error('Invalid credentials'));
          }
        } catch (error) {
          reject(error);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          if (name && email && password.length >= 6) {
            const newUser = {
              id: Math.random().toString(36).substring(2, 9),
              name,
              email,
            };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            document.cookie = `user_session=true; path=/; max-age=${60 * 60 * 24 * 7}`;
            resolve();
            router.push('/dashboard');
          } else {
            reject(new Error('Invalid registration data'));
          }
        } catch (error) {
          reject(error);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    });
  };

  const loginWithProvider = async (provider: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          const newUser = {
            id: Math.random().toString(36).substring(2, 9),
            name: `User ${Math.floor(Math.random() * 1000)}`,
            email: `user${Math.floor(Math.random() * 1000)}@example.com`,
            provider,
          };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          document.cookie = `user_session=true; path=/; max-age=${60 * 60 * 24 * 7}`;
          resolve();
          router.push('/dashboard');
        } catch (error) {
          reject(error);
        } finally {
          setIsLoading(false);
        }
      }, 1500);
    });
  };

  const logout = () => {
    setIsLoading(true);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('savedTranslations');
    document.cookie = 'user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 300);
  };

  const value: AuthContextProps = {
    user,
    isLoading,
    login,
    register,
    loginWithProvider,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
