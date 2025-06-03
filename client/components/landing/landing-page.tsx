'use client';

import React, { useEffect } from 'react';
import HeroSection from './hero-section';
import FeaturesSection from './features-section';
import FAQSection from './faq-section';
import axios from 'axios';
import { useAuth } from '@/hooks/use-auth';

const API_URL: string = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const LandingPage = () => {
  const { setUser } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/authentication/user`, {
          withCredentials: true,
        });
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem('user');
        setUser(null);
      }
    };
    getUser();
  }, []);
  return (
    <div className='relative'>
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
    </div>
  );
};

export default LandingPage;
