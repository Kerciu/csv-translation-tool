import React, { useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { ChevronsUpDown, Filter, Search } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from './ui/command';
import SelectedActions from './selection-actions';
import ColumnList from './column-list';
import SelectedColumnBadges from './selected-column-badges';

interface ColumnSelectorProps {
  headers: string[];
  selectedColumns: string[];
  onColumnToggle: (column: string, isShiftKey?: boolean, isCtrlKey?: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const ColumnSelector = ({
  headers,
  selectedColumns,
  onColumnToggle,
  onSelectAll,
  onDeselectAll,
}: ColumnSelectorProps) => {
  const [open, setOpen] = useState(false);
  const lastSelectedRef = useRef<string | null>(null);

  const handleSelect = (column: string, e?: React.MouseEvent) => {
    onColumnToggle(column, e?.shiftKey, e?.ctrlKey || e?.metaKey);
    lastSelectedRef.current = column;
  };

  return (
    <div className='space-y-4'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            <div className='flex items-center gap-2 truncate'>
              <Filter className='size-4 shrink-0 opacity-50' />
              <span className='truncate'>
                {selectedColumns.length > 0
                  ? `${selectedColumns.length} column${selectedColumns.length > 0 ? 's' : ''} selected`
                  : 'Select columns to translate...'}
              </span>
            </div>

            <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-full p-0' align='start' side='bottom'>
          <Command>
            <div className='flex items-center border-b px-3'>
              <CommandInput
                placeholder='Search columns...'
                className='border-0 py-3 shadow-none focus-visible:ring-0'
              />
            </div>

            <SelectedActions
              selectedCount={selectedColumns.length}
              totalCount={headers.length}
              onSelectAll={onSelectAll}
              onDeselectAll={onDeselectAll}
            />

            <CommandList>
              <CommandEmpty>No columns found.</CommandEmpty>
              <CommandGroup>
                <ColumnList
                  headers={headers}
                  selectedColumns={selectedColumns}
                  onSelect={handleSelect}
                />
              </CommandGroup>
            </CommandList>

            <div className='border-t p-2 text-xs text-muted-foreground'>
              <p>Tip: Use Shift+Click to select a range, Ctrl/Cmd+Click to select multiple</p>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <SelectedColumnBadges
        selectedColumns={selectedColumns}
        onRemove={(column) => onColumnToggle(column)}
      />
    </div>
  );
};

export default ColumnSelector;
