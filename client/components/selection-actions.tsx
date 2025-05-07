import React from 'react';
import { Button } from './ui/button';

interface SelectedActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const SelectionActions = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
}: SelectedActionsProps) => {
  return (
    <div className='flex items-center justify-between border-b px-3 py-2'>
      <span className='text-sm text-muted-foreground'>
        {selectedCount} out of {totalCount} selected
      </span>

      <div className='flex gap-2'>
        <Button variant='ghost' size='sm' className='h-7 text-xs' onClick={onDeselectAll}>
          Deselect All
        </Button>

        <Button variant='ghost' size='sm' className='h-7 text-xs' onClick={onSelectAll}>
          Select All
        </Button>
      </div>
    </div>
  );
};

export default SelectionActions;
