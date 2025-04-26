import React from 'react'
import { ScrollArea } from './ui/scroll-area'
import { CommandItem } from './ui/command'
import { Check } from 'lucide-react'

interface ColumnListProps {
  headers: string[]
  selectedColumns: string[]
  onSelect: (column: string, e?: React.MouseEvent) => void
}

const ColumnList = ({ headers, selectedColumns, onSelect }: ColumnListProps) => {

  const handleHeaderClick = (header: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(header, e);
  }

  return (
    <ScrollArea className='h-[200px]'>
      {headers.map((header) => (
        <CommandItem
          key={header}
          value={header}
          onSelect={() => onSelect(header)}
          className='cursor-pointer'
        >

          <div
            onClick={(e) => handleHeaderClick(header, e)}
          >
            <div>
              <Check />
            </div>

            <span>{header}</span>
          </div>

        </CommandItem>
      ))}
    </ScrollArea>
  )
}

export default ColumnList