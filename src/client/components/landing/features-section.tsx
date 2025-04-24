import features from '@/data/features'
import React from 'react'

const FeaturesSection = () => {
  return (
    <section>
      <div>
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
            <div>
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