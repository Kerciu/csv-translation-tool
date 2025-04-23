import React from 'react'
import { Badge } from '../ui/badge'

const HeroSection = () => {
  return (
    <section>
        <div>
            <div>
                <div>
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