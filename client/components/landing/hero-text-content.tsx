import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';

const HeroTextContent = () => {
  return (
    <div className='space-y-5'>
      <Badge variant='outline' className='border-primary/2 bg-primary/5 px-3 py-1 text-sm'>
        AI-Powered Translator
      </Badge>
      <h1 className='text-4xl font-bold tracking-tight md:text-5xl'>
        CSV Translations <span className='text-primary'>Made Simple</span>
      </h1>
      <p className='text-lg text-muted-foreground'>
        Translate your CSV files with ease. Choose columns & rows, select languages and edit
        translations manually.
      </p>

      <div className='flex flex-col gap-3 pt-2 sm:flex-row'>
        <Button size='lg' className='gap-2'>
          Get Started <ArrowRight className='size-4' />
        </Button>
      </div>
    </div>
  );
};

export default HeroTextContent;
