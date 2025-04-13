import React from 'react'
import DataTranslationOption from './column-translation-option'
import LanguageTranslationOption from './language-translation-option'

interface TranslationOptionsProps {
    headers: string[]
    selectedColumns: string[]
    targetLanguage: string
    onColumnToggle: (column: string) => void
    onLanguageChange: (language: string) => void
}

const TranslationOptions = ({ headers, selectedColumns, targetLanguage, onColumnToggle, onLanguageChange }: TranslationOptionsProps) => {
  return (
    <div className='grid md:grid-cols-2 gap-4'>
        <DataTranslationOption
            headers={headers}
            selectedColumns={selectedColumns}
            onColumnToggle={onColumnToggle}
        />
        <LanguageTranslationOption/>
    </div>
  )
}

export default TranslationOptions