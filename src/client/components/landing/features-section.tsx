import features from '@/data/features'
import React from 'react'

const FeaturesSection = () => {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-background'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground'>
              Features
            </div>
            <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
              Everything You Need for CSV Translation
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Our powerful translation tool provides all the features you need to translate your CSV files quickly and accurately.
            </p>
          </div>
        </div>

        <div>
          {features.map((feat, idx) => (
            <div key={idx}>
              <div>
                <feat.icon />
              </div>

              <h3>{feat.title}</h3>
              <p>{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection