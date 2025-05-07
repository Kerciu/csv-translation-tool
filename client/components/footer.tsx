import React from 'react';
import CreatorInfo from './creator-info';

interface Creator {
  name: string;
  githubLink: string;
  linkedinLink: string;
}

const Footer = () => {
  const Kacper: Creator = {
    name: 'Kacper Górski',
    githubLink: 'https://github.com/Kerciu',
    linkedinLink: 'https://linkedin.com/in/kacper-gorski-se',
  };

  const Szymon: Creator = {
    name: 'Szymon Kamiński',
    githubLink: 'https://github.com/RudyKarpus',
    linkedinLink: 'https://linkedin.com/in/szymonkaminski',
  };

  return (
    <footer className='border-t py-6 md:py-0'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row'>
          <p className='text-center text-sm text-muted-foreground md:text-left'>
            &copy; {new Date().getFullYear()} CSV Translation Tool. All rights reserved.
          </p>

          <div className='flex flex-col items-center gap-4 md:flex-row'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>Created by:</span>
              <div className='flex flex-col md:flex-row md:gap-4'>
                <CreatorInfo
                  fullName={Kacper.name}
                  githubLink={Kacper.githubLink}
                  linkedinLink={Kacper.linkedinLink}
                />
                <CreatorInfo
                  fullName={Szymon.name}
                  githubLink={Szymon.githubLink}
                  linkedinLink={Szymon.linkedinLink}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
