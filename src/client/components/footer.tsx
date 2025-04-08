import React from 'react'
import CreatorInfo from './creator-info'

const Footer = () => {
  return (
    <footer className='border-t py-6 md:py-0'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row'>
          <p className='text-center text-sm text-muted-foreground md:text-left'>
            CSV Translation Tool. All rights reserved.
          </p>

          <div className='flex flex-col items-center gap-4 md:flex-row'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>Created by:</span>
              <div className='flex flex-col md:flex-row md:gap-4'>
                <CreatorInfo fullName="Kacper Górski" githubLink="8.8.8.8" linkedinLink="8.8.8.8"/>
                <CreatorInfo fullName="Szymon Kamiński" githubLink="8.8.8.8" linkedinLink="8.8.8.8"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer