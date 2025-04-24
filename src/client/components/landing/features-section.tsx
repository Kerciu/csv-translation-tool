import features from '@/data/features'
import React from 'react'

const FeaturesSection = () => {
  return (
    <section className="py-12 bg-muted/20">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {
              features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4">
                <div className="bg-primary/10 p-2 rounded-md shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default FeaturesSection