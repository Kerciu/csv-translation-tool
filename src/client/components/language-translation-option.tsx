import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import LanguagePopover from './language-popover'
import { LanguageType } from '@/lib/types'

interface LanguageTranslationOptionProps {
    sourceLanguage: string
    targetLanguage: string
    onLanguageChange: (type: LanguageType, language: string) => void
}

const LanguageTranslationOption = ({ sourceLanguage, targetLanguage, onLanguageChange }: LanguageTranslationOptionProps) => {

  const [targetOpen, setTargetOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Translation Languages</CardTitle>
      </CardHeader>

      <CardContent>
        <div className='space-y-4'>
          <LanguagePopover
            operationType='Target Language'
            operationLanguage={targetLanguage}
            open={targetOpen}
            setOpen={setTargetOpen}
            onLanguageChange={onLanguageChange}
          />

          <LanguagePopover
            operationType='Source Language'
            operationLanguage={sourceLanguage}
            open={sourceOpen}
            setOpen={setSourceOpen}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default LanguageTranslationOption