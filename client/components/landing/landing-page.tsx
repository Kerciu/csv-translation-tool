'use client';

import React, { useEffect } from 'react';
import HeroSection from './hero-section';
import FeaturesSection from './features-section';
import FAQSection from './faq-section';
import axios from 'axios';
const API_URL: string = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const LandingPage = () => {
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/authentication/user`, {
          withCredentials: true,
        });
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (error) {
        localStorage.removeItem('user');
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
