import React from 'react'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { Popover, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

interface ColumnSelectorProps {
    headers: string[]
    selectedColumns: string[]
    onColumnToggle: (column: string) => void
}

const ColumnSelector = ({ headers, selectedColumns, onColumnToggle }: ColumnSelectorProps) => {
  return (
    // <div className='grid grid-cols-2 gap-4'>
    //     {headers.map((header, idx) => (
    //         <div key={idx} className='flex items-center space-x-2'>
    //         <Checkbox
    //             id={`column-${header}`}
    //             checked={selectedColumns.includes(header)}
    //             onCheckedChange={() => onColumnToggle(header)}
    //         />
    //         <Label htmlFor={`column-${header}`} className='text-sm cursor-pointer overflow-hidden text-elipsis'>
    //             {header}
    //         </Label>
    //         </div>
    //     ))}
    // </div>
    <div className='space-y-4'>
        <Popover>
            <PopoverTrigger>
                <Button>
                    {selectedColumns.length > 0 ?
                    `${selectedColumns.length} column${selectedColumns.length > 0 ? "s" : ""} selected`
                    : "Select columns to translate..."
                    }
                </Button>
            </PopoverTrigger>
        </Popover>
    </div>
  )
}

export default ColumnSelector