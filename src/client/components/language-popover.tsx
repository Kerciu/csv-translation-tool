import React from 'react'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import languages from '@/data/languages'
import { cn } from '@/lib/utils'

interface LanguagePopoverProps {
    operationType: "Target Language" | "Source Language"
    operationLanguage: string
    open: boolean
    setOpen: (open: boolean) => void
    onLanguageChange: (language: string) => void
}

const LanguagePopover = ({
    operationType,
    operationLanguage,
    open,
    setOpen,
    onLanguageChange
    }: LanguagePopoverProps) => {

  const htmlId: string = operationType.replace(" ", "-").toLowerCase();

  return (
    <div>
          <Label htmlFor={htmlId}>{operationType}</Label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button id={htmlId} variant='outline' role='combobox' className='w-full justify-between'>
                {operationLanguage ? languages.find((lang) => (lang.value === operationLanguage))?.label
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
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              operationLanguage === lang.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {lang.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>

                  </CommandList>

                </Command>
            </PopoverContent>
          </Popover>
        </div>
  )
}

export default LanguagePopover