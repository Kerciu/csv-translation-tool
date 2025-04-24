import React from 'react'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { Badge } from '../ui/badge'

const HeroTextContent = () => {
  return (
    <div className='space-y-5'>
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
  )
}

export default HeroTextContent