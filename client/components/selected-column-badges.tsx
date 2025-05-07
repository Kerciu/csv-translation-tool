import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface SelectedColumnBadgesProps {
  selectedColumns: string[];
  onRemove: (column: string) => void;
}

const SelectedColumnBadges = ({ selectedColumns, onRemove }: SelectedColumnBadgesProps) => {
  if (selectedColumns.length === 0) return null;

  return (
    <ScrollArea className='max-h-[120px]'>
      <div className='flex flex-wrap gap-2 p-1'>
        {selectedColumns.map((column) => (
          <Badge key={column} variant='secondary' className='flex max-w-full items-center gap-1'>
            <span className='truncate'>{column}</span>
            <X
              className='size-3 shrink-0 cursor-pointer'
              onClick={(e) => {
                e.stopPropagation();
                onRemove(column);
              }}
            />
          </Badge>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SelectedColumnBadges;
