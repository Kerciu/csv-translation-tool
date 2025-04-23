import React from 'react'
import { Badge } from '../ui/badge'

const HeroSection = () => {
  return (
    <section className='relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background-via-background to-muted/30'>
        <div className='container px-4 mx-auto'>
            <div className='flex flex-col lg:flex-row items-center gap-12'>
                <div className='lg:w-1/2 space-y-5'>
                    <Badge variant='outline'>
                        AI-Powered Translator
                    </Badge>
                    <h1>
                        CSV Translations <span>Made Simple</span>
                    </h1>
                    <p>
                        Translate your CSV files with ease. Choose columns & rows, select languages and edit translations manually.
                    </p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection