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