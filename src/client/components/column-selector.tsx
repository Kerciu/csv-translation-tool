import React, { useState } from 'react'
import { Popover, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { ChevronsUpDown, Filter } from 'lucide-react'

interface ColumnSelectorProps {
    headers: string[]
    selectedColumns: string[]
    onColumnToggle: (column: string) => void
}

const ColumnSelector = ({ headers, selectedColumns, onColumnToggle }: ColumnSelectorProps) => {

    const [open, setOpen] = useState(false);

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
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between'
                >
                    <div className='flex items-center gap-2 truncate'>
                        <Filter className='h-4 w-4 shrink-0 opacity-50'/>
                        <span className='truncate'>
                            {selectedColumns.length > 0 ?
                            `${selectedColumns.length} column${selectedColumns.length > 0 ? "s" : ""} selected`
                            : "Select columns to translate..."
                            }
                        </span>
                    </div>

                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
        </Popover>
    </div>
  )
}

export default ColumnSelector