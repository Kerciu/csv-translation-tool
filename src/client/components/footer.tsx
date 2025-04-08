import { Github } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CreatorInfo from './creator-info'

const Footer = () => {
  return (
    <footer>
      <div>
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