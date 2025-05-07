import React from 'react';
import { Button } from './ui/button';
import { AlertTriangle, Download, Languages } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TranslationButtonsProps {
  isTranslating: boolean;
  isTranslated: boolean;
  selectedColumnsCount: number;
  translationErrors: { row: number; col: number }[];
  translateCSV: () => void;
  downloadCSV: () => void;
  onHighlightErrors: () => void;
}

const TranslationButtons = ({
  translateCSV,
  downloadCSV,
  isTranslating,
  isTranslated,
  selectedColumnsCount,
  translationErrors,
  onHighlightErrors,
}: TranslationButtonsProps) => {
  return (
    <div className='my-4 flex flex-wrap justify-center gap-4'>
      <Button
        className='gap-2'
        onClick={translateCSV}
        disabled={isTranslating || selectedColumnsCount === 0}
      >
        <Languages className='size-4' />
        {isTranslating ? 'Translating...' : 'Translate Selected Columns'}
      </Button>

      {isTranslated && (
        <Button variant='outline' onClick={downloadCSV} className='gap-2'>
          <Download className='size-4' />
          Download Translated CSV
        </Button>
      )}

      {Array.isArray(translationErrors) && translationErrors.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                className='gap-2 border-amber-500 text-amber-500'
                onClick={onHighlightErrors}
              >
                <AlertTriangle className='size-4' />
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
  );
};

export default TranslationButtons;
