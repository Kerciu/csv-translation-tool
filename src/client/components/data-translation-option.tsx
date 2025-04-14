import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'

interface DataTranslationOptionProps {
    headers: string[]
    selectedColumns: string[]
    onColumnToggle: (column: string) => void
}

const DataTranslationOption = ({ headers, selectedColumns, onColumnToggle }: DataTranslationOptionProps) => {
  return (
    <Card>
      <CardHeader>
          <CardTitle className='text-lg'>Select Columns to Translate</CardTitle>
      </CardHeader>

      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          {headers.map((header, idx) => (
              <div key={idx} className='flex items-center space-x-2'>
                <Checkbox 
                  id={`column-${header}`}
                  checked={selectedColumns.includes(header)}
                  onCheckedChange={() => onColumnToggle(header)}
                />
                <Label htmlFor={`column-${header}`} className='text-sm cursor-pointer overflow-hidden text-elipsis'>
                  {header}
                </Label>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default DataTranslationOption