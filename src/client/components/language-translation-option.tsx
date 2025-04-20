import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import LanguagePopover from './language-popover'

interface LanguageTranslationOptionProps {
    selectedColumnsCount: number
    targetLanguage: string
    onLanguageChange: (language: string) => void
}

const LanguageTranslationOption = ({ selectedColumnsCount, targetLanguage, onLanguageChange }: LanguageTranslationOptionProps) => {

  const [open, setOpen] = useState(false);

  const operationType: string = "abc";

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
            open={open}
            setOpen={setOpen}
            onLanguageChange={onLanguageChange}
          />

          <LanguagePopover
            operationType='Target Language'
            operationLanguage={targetLanguage}
            open={open}
            setOpen={setOpen}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default LanguageTranslationOption