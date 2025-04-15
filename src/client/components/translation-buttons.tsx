import React from 'react'
import { Button } from './ui/button'
import { Download, Languages } from 'lucide-react'

interface TranslationButtonsProps {
    isTranslating: boolean
    isTranslated: boolean
    selectedColumnsCount: number
    translateCSV: () => void
    downloadCSV: () => void
}

const TranslationButtons = ({ translateCSV, downloadCSV, isTranslating, isTranslated, selectedColumnsCount }: TranslationButtonsProps) => {
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

        {isTranslated && 
            <Button 
                variant='outline' 
                onClick={downloadCSV} 
                className='gap-2'
            >
                <Download className='w-4 h-4'/>
                Download Translated CSV
            </Button>
        }
    </div>
  )
}

export default TranslationButtons