import { Github, Linkedin } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface CreatorInfoProps {
    fullName: string
    githubLink: string
    linkedinLink: string
}

const CreatorInfo = ({ fullName, githubLink, linkedinLink }: CreatorInfoProps) => {
  return (
    <div className='flex items-center gap-1'>
        <span className='text-sm font-medium'>{fullName}</span>
        <div className='flex items-center gap-1'>
            <Link
                href={githubLink}
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-foreground'
            >
                <Github className='h-4 w-4'/>
                <span className='sr-only'>GitHub</span>
            </Link>
            <Link
                href={linkedinLink}
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-foreground m1-1'
            >
                <Linkedin className='h-4 w-4'/>
                <span className='sr-only'>LinkedIn</span>
            </Link>
        </div>
    </div>
  )
}

export default CreatorInfo