import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import CSVPreview from './csv-preview';
import HeroTextContent from './hero-text-content';

const HeroSection = () => {
  return (
    <section className='from-background-via-background relative overflow-hidden bg-gradient-to-b to-muted/30 py-16 md:py-24'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center gap-12 lg:flex-row'>
          <div className='lg:w-1/2'>
            <HeroTextContent />
          </div>

          <div className='lg:w-1/2'>
            <CSVPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
