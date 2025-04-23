import React from 'react'
import { Badge } from '../ui/badge'

const HeroSection = () => {
  return (
    <section className='relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background-via-background to-muted/30'>
        <div className='container px-4 mx-auto'>
            <div className='flex flex-col lg:flex-row items-center gap-12'>
                <div className='lg:w-1/2 space-y-5'>
                    <Badge variant='outline' className='px-3 py-1 text-sm bg-primary/5 border-primary/2'>
                        AI-Powered Translator
                    </Badge>
                    <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
                        CSV Translations <span className='text-primary'>Made Simple</span>
                    </h1>
                    <p className='text-lg text-muted-foreground'>
                        Translate your CSV files with ease. Choose columns & rows, select languages and edit translations manually.
                    </p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection