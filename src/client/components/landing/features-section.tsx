import features from '@/data/features'
import React from 'react'

const FeaturesSection = () => {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-background'>
      <div className='container px-4 md:px-6'>
        <div>
          <div>
            <div>
              Features
            </div>
            <h2>
              Everything You Need for CSV Translation
            </h2>
            <p>
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