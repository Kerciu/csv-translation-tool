import React from 'react'
import CreatorInfo from './creator-info'

const Footer = () => {
  return (
    <footer className='border-t py-6 md:py-0'>
      <div className='container mx-auto px-4'>
        <div>
          <p>
            CSV Translation Tool. All rights reserved.
          </p>

          <div>
            <div>
              <span>Created by:</span>
              <div>
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