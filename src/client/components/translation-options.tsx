import React from 'react'
import DataTranslationOption from './data-translation-option'
import LanguageTranslationOption from './language-translation-option'
import { LanguageType } from '@/lib/types'

interface TranslationOptionsProps {
    headers: string[]
    selectedColumns: string[]
    sourceLanguage: string
    targetLanguage: string
    onColumnToggle: (column: string) => void
    onLanguageChange: (type: LanguageType, language: string) => void
}

const TranslationOptions = ({
    headers,
    selectedColumns,
    sourceLanguage,
    targetLanguage,
    onColumnToggle,
    onLanguageChange
  }: TranslationOptionsProps) => {

  return (
    <div className='grid md:grid-cols-2 gap-4'>
        <DataTranslationOption
            headers={headers}
            selectedColumns={selectedColumns}
            onColumnToggle={onColumnToggle}
        />
        <LanguageTranslationOption
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onLanguageChange={onLanguageChange}
        />
    </div>
  )
}

export default TranslationOptions