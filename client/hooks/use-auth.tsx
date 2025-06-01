'use client';

import type React from 'react';
import axios from 'axios';
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
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const API_URL: string = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      console.log('Login failed:', 'any');

      if (!email) {
        throw new Error('Invalid credentials');
      }
      if (password.length < 6) {
        throw new Error('Too short password');
      }

      const auth_res = await axios.post(
        `${API_URL}/authentication/log`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true },
      );
      const res = await axios.get(`${API_URL}/authentication/user`, {
        withCredentials: true,
      });
      setResponse(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setIsLoading(false);

      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const auth_res = await axios.post(
        `${API_URL}/authentication/sign`,
        {
          email: email,
          password: password,
          username: name,
        },
        { withCredentials: true },
      );
      const res = await axios.get(`${API_URL}/authentication/user`, {
        withCredentials: true,
      });
      setResponse(res.data);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setIsLoading(false);

      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);

      throw error;
    }
    setIsLoading(false);
  };

  const loginWithProvider = async (provider: string) => {
    setIsLoading(true);

    try {
      const res = await axios.get(`${API_URL}/authentication/${provider}/`);
      if (res.data.auth_url) {
        window.location.href = res.data.auth_url;
      } else {
        console.error('No auth_url returned');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('OAuth login error:', err);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await axios.post(
      `${API_URL}/authentication/logout`,
      {},
      {
        withCredentials: true,
      },
    );
    router.push('/');
    setResponse(axios.response);
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextProps = {
    user,
    isLoading,
    login,
    register,
    loginWithProvider,
    logout,
    setUser,
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
