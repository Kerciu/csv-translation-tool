import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import LanguagePopover from './language-popover';
import { LanguageType } from '@/lib/types';

interface LanguageTranslationOptionProps {
  sourceLanguage: string;
  targetLanguage: string;
  translationMap: Result<string, string[]>;
  onLanguageChange: (type: LanguageType, language: string) => void;
}

const LanguageTranslationOption = ({
  sourceLanguage = 'en',
  targetLanguage = 'de',
  translationMap,
  onLanguageChange,
}: LanguageTranslationOptionProps) => {
  const [targetOpen, setTargetOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);

  const getAvailableTargets = (src: string) => {
    if (src === 'auto') return Object.values(translationMap).flat();
    return translationMap[src] || [];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Translation Languages</CardTitle>
      </CardHeader>

      <CardContent>
        <div className='space-y-4'>
          <LanguagePopover
            operationType='Source Language'
            operationLanguage={sourceLanguage}
            open={sourceOpen}
            setOpen={setSourceOpen}
            onLanguageChange={(type, lang) => {
              onLanguageChange(type, lang);
              if (type === 'source') setTargetOpen(false);
            }}
            availableLanguages={['auto', ...Object.keys(translationMap)]}
          />
        </div>

        <div className='space-y-4'>
          <LanguagePopover
            operationType='Target Language'
            operationLanguage={targetLanguage}
            open={targetOpen}
            setOpen={setTargetOpen}
            onLanguageChange={onLanguageChange}
            availableLanguages={getAvailableTargets(sourceLanguage)
              .filter(lang => lang !== sourceLanguage)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageTranslationOption;
