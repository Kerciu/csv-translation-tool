import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import CSVPreview from './csv-preview'

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

                    <div className='flex flex-col sm:flex-row gap-3 pt-2'>
                        <Button size='lg' className='gap-2'>
                            Get Started <ArrowRight className='w-4 h-4'/>
                        </Button>
                    </div>
                </div>

                <div className='lg:w=1/2'>
                    <CSVPreview />
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection