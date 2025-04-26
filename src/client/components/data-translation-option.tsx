import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import ColumnSelector from './column-selector'

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
        <ColumnSelector
            headers={headers}
            selectedColumns={selectedColumns}
            onColumnToggle={onColumnToggle}
        />
      </CardContent>
    </Card>
  )
}

export default DataTranslationOption