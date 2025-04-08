import { Github, Linkedin } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CreatorInfo = ({ fullName, githubLink, linkedinLink }: any) => {
  return (
    <div>
        <span>{fullName}</span>
        <div>
            <Link
                href={githubLink}
                target='_blank'
                rel='noopener noreferrer'
            >
                <Github />
                <span>GitHub</span>
            </Link>
            <Link
                href={linkedinLink}
                target='_blank'
                rel='noopener noreferrer'
            >
                <Linkedin />
                <span>LinkedIn</span>
            </Link>
        </div>
    </div>
  )
}

export default CreatorInfo