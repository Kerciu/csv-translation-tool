import React from 'react';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Check, ChevronsUpDown, Globe } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import languages from '@/data/languages';
import { cn } from '@/lib/utils';
import { LanguageType } from '@/lib/types';
import { getLanguageInfo } from '@/utils/getLanguageInfo';

interface LanguagePopoverProps {
  operationType: 'Target Language' | 'Source Language';
  operationLanguage: string;
  open: boolean;
  availableLanguages: string[];
  setOpen: (open: boolean) => void;
  onLanguageChange: (type: LanguageType, language: string) => void;
}

const LanguagePopover = ({
  operationType,
  operationLanguage,
  open,
  availableLanguages,
  setOpen,
  onLanguageChange,
}: LanguagePopoverProps) => {
  const languageType = operationType.split(' ')[0].toLowerCase() as LanguageType;
  const htmlId = `language-select-${languageType}`;

  const languageList = availableLanguages
    ? availableLanguages.map(code => getLanguageInfo(code))
    : languages;

  return (
    <div className='space-y-2'>
      <Label htmlFor={htmlId}>{operationType}</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={htmlId}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            {operationLanguage ? (
              <div className='flex items-center gap-2'>
                <span>{getLanguageInfo(operationLanguage).flag}</span>
                <span>{getLanguageInfo(operationLanguage).label}</span>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <Globe className='size-4' />
                <span>Select target language...</span>
              </div>
            )}
            <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-full p-0' align='start'>
          <Command>
            <CommandInput placeholder='Search a language...' />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {languageList.map((lang) => (
                  <CommandItem
                    key={lang.value}
                    value={lang.value}
                    onSelect={(currentValue) => {
                      onLanguageChange(languageType, currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        operationLanguage === lang.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <span className='mr-1'>{lang.flag}</span>
                    {lang.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LanguagePopover;
