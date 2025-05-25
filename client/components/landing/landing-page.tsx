'use client';

import React, { useEffect} from 'react';
import HeroSection from './hero-section';
import FeaturesSection from './features-section';
import FAQSection from './faq-section';
import axios from 'axios';

const LandingPage = () => {
   useEffect(() => {
      const getUser = async () => {
        try {
          const res = await axios.get('http://localhost:8000/authentication/user',
                { withCredentials: true }
            );
          localStorage.setItem('user', JSON.stringify(res.data));

        } catch (error) {};
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
