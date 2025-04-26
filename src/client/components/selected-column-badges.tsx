import React from 'react'
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface SelectedColumnBadgesProps {
  selectedColumns: string[]
  onRemove: (column: string) => void
}

const SelectedColumnBadges = ({ selectedColumns, onRemove }: SelectedColumnBadgesProps) => {

  if (selectedColumns.length === 0) return null;

  return (
    <ScrollArea className='max-h-[120px]'>
      <div className='flex flex-wrap gap-2 p-1'>
        {selectedColumns.map((column) => (
          <Badge
            key={column}
            variant='secondary'
            className='flex items-center gap-1 max-w-full'
          >
            <span className='truncate'>{column}</span>
            <X
              className='h-3 w-3 cursor-pointer flex-shrink-0'
              onClick={(e) => {
                e.stopPropagation();
                onRemove(column);
              }}
            />
          </Badge>
        ))}
      </div>
    </ScrollArea>
  )
}

export default SelectedColumnBadges