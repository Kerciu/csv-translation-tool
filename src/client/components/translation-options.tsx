import React from 'react'
import DataTranslationOption from './column-translation-option'
import LanguageTranslationOption from './language-translation-option'

const TranslationOptions = () => {
  return (
    <div className='grid md:grid-cols-2 gap-4'>
        <DataTranslationOption/>
        <LanguageTranslationOption/>
    </div>
  )
}

export default TranslationOptions