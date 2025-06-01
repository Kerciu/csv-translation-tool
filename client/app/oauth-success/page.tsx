'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/hooks/use-auth';

const API_URL: string = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const OAuthSuccess = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/authentication/user`, {
          withCredentials: true,
        });
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
        router.push('/dashboard');
      } catch (err) {
        console.error('Failed to get profile', err);
      }
    };
    fetchProfile();
  }, []);

  return <div>Logging you in...</div>;
};

export default OAuthSuccess;
