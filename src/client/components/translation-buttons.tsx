import React from 'react'
import { Button } from './ui/button'
import { Languages } from 'lucide-react'

interface TranslationButtonsProps {
    isTranslating: boolean
    selectedColumnsCount: number
    translateCSV: () => void
}

const TranslationButtons = ({ isTranslating, selectedColumnsCount, translateCSV }: TranslationButtonsProps) => {
  return (
    <div className='flex flex-wrap justify-center gap-4 my-4'>
        <Button 
            className='gap-2'
            onClick={translateCSV}
            disabled={isTranslating || selectedColumnsCount === 0}
        >    
            <Languages className='h-4 w-4'/>
            {isTranslating ? "Translating..." : "Translate Selected Columns"}
        </Button>
    </div>
  )
}

export default TranslationButtons