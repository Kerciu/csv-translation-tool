import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { CommandItem } from './ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColumnListProps {
  headers: string[];
  selectedColumns: string[];
  onSelect: (column: string, e?: React.MouseEvent) => void;
}

const ColumnList = ({ headers, selectedColumns, onSelect }: ColumnListProps) => {
  const handleHeaderClick = (header: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(header, e);
  };

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
            className='flex w-full items-center gap-2'
          >
            <div
              className={cn(
                'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                selectedColumns.includes(header)
                  ? 'bg-primary text-primary-foreground'
                  : 'opacity-50 [&_svg]:invisible',
              )}
            >
              <Check className='size-3' />
            </div>

            <span className='truncate'>{header}</span>
          </div>
        </CommandItem>
      ))}
    </ScrollArea>
  );
};

export default ColumnList;
