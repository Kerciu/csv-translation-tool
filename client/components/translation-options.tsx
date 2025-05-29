import React from 'react';
import DataTranslationOption from './data-translation-option';
import LanguageTranslationOption from './language-translation-option';
import { LanguageType } from '@/lib/types';

interface TranslationOptionsProps {
  headers: string[];
  selectedColumns: string[];
  sourceLanguage: string;
  targetLanguage: string;
  translationMap: Result<string, string[]>;
  onColumnToggle: (column: string, isShiftKey?: boolean, isCtrlKey?: boolean) => void;
  onLanguageChange: (type: LanguageType, language: string) => void;
  onSelectAllColumns: () => void;
  onDeselectAllColumns: () => void;
}

const TranslationOptions = ({
  headers,
  selectedColumns,
  sourceLanguage,
  targetLanguage,
  translationMap,
  onColumnToggle,
  onLanguageChange,
  onSelectAllColumns,
  onDeselectAllColumns,
}: TranslationOptionsProps) => {
  return (
    <div className='grid gap-4 md:grid-cols-2'>
      <DataTranslationOption
        headers={headers}
        selectedColumns={selectedColumns}
        onColumnToggle={onColumnToggle}
        onSelectAllColumns={onSelectAllColumns}
        onDeselectAllColumns={onDeselectAllColumns}
      />
      <LanguageTranslationOption
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        translationMap={translationMap}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
};

export default TranslationOptions;
