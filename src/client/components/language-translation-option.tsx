import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface LanguageTranslationOptionProps {
    selectedColumnsCount: number
    targetLanguage: string
    onLanguageChange: (language: string) => void
}

const LanguageTranslationOption = ({ selectedColumnsCount, targetLanguage, onLanguageChange }: LanguageTranslationOptionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Target Language</CardTitle>
      </CardHeader>

      <CardContent>

      </CardContent>
    </Card>
  )
}

export default LanguageTranslationOption