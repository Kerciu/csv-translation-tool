import React from 'react'
import { Button } from './ui/button'
import { AlertTriangle, Download, Languages } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

interface TranslationButtonsProps {
    isTranslating: boolean
    isTranslated: boolean
    selectedColumnsCount: number
    translationErros: {row: number, col: number}[]
    translateCSV: () => void
    downloadCSV: () => void
}

const TranslationButtons = ({ translateCSV, downloadCSV, isTranslating, isTranslated, selectedColumnsCount, translationErros }: TranslationButtonsProps) => {
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

        {translationErrors.length > 0 && (
            <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                    variant="outline"
                    className="gap-2 text-amber-500 border-amber-500"
                    >
                    <AlertTriangle className="h-4 w-4" />
                    {translationErrors.length} Translation Issues
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Some cells couldn't be translated accurately. Click to highlight all issues.</p>
                </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )}
    </div>
  )
}

export default TranslationButtons