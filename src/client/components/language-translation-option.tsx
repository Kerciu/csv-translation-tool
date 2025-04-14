import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Popover, PopoverContent } from './ui/popover'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { Button } from './ui/button'
import { ChevronsUpDown } from 'lucide-react'
import { CommandInput, Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from './ui/command'

interface LanguageTranslationOptionProps {
    selectedColumnsCount: number
    targetLanguage: string
    onLanguageChange: (language: string) => void
}

const LanguageTranslationOption = ({ selectedColumnsCount, targetLanguage, onLanguageChange }: LanguageTranslationOptionProps) => {

  const [open, setOpen] = useState(false);

  const languages = [
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ru", label: "Russian" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "ar", label: "Arabic" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Target Language</CardTitle>
      </CardHeader>

      <CardContent>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant='outline' role='combobox' className='w-full justify-between'>
              {targetLanguage ? languages.find((lang) => (lang.value === targetLanguage))?.label
                : "Select language..."
              }
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
            </Button>
          </PopoverTrigger>

          <PopoverContent className='w-full p-0'>
              <Command>
                <CommandInput placeholder='Search a language...'/>

                <CommandList>
                  <CommandEmpty>No language found.</CommandEmpty>

                  <CommandGroup>
                    {languages.map((lang, idx) => (
                      <CommandItem
                        key={lang.value}
                        value={lang.value}
                        onSelect={(currValue) => {
                          onLanguageChange(currValue)
                          setOpen(false)
                        }}
                      >
                        {lang.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                </CommandList>

              </Command>
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  )
}

export default LanguageTranslationOption