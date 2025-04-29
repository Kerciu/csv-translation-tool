import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import CSVPreview from './csv-preview'
import HeroTextContent from './hero-text-content'

const HeroSection = () => {
  return (
    <section className='relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background-via-background to-muted/30'>
        <div className='container px-4 mx-auto'>
            <div className='flex flex-col lg:flex-row items-center gap-12'>
                <div className='lg:w-1/2'>
                    <HeroTextContent />
                </div>

                <div className='lg:w-1/2'>
                    <CSVPreview />
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection