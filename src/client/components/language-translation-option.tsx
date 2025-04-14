import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Popover, PopoverContent } from './ui/popover'
import { PopoverTrigger } from '@radix-ui/react-popover'

interface LanguageTranslationOptionProps {
    selectedColumnsCount: number
    targetLanguage: string
    onLanguageChange: (language: string) => void
}

const LanguageTranslationOption = ({ selectedColumnsCount, targetLanguage, onLanguageChange }: LanguageTranslationOptionProps) => {

  const languages = [
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ru", label: "Russian" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "ar", label: "Arabic" },
  ]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Target Language</CardTitle>
      </CardHeader>

      <CardContent>
        <Popover>
          <PopoverTrigger asChild>

          </PopoverTrigger>

          <PopoverContent>

          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  )
}

export default LanguageTranslationOption