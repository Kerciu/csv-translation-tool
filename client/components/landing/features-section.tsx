import features from '@/data/features';
import React from 'react';

const FeaturesSection = () => {
  return (
    <section className='bg-muted/20 py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid gap-6 md:grid-cols-3'>
          {features.map((feature, index) => (
            <div key={index} className='flex items-start gap-3 p-4'>
              <div className='shrink-0 rounded-md bg-primary/10 p-2'>
                <feature.icon className='size-5 text-primary' />
              </div>
              <div>
                <h3 className='mb-1 font-medium'>{feature.title}</h3>
                <p className='text-sm text-muted-foreground'>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
