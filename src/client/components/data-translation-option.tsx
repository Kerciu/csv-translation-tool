import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import ColumnSelector from './column-selector'

interface DataTranslationOptionProps {
    headers: string[]
    selectedColumns: string[]
    onColumnToggle: (column: string, isShiftKey?: boolean, isCtrlKey?: boolean) => void
    onSelectAllColumns: () => void
    onDeselectAllColumns: () => void
}

const DataTranslationOption = ({
    headers,
    selectedColumns,
    onColumnToggle,
    onSelectAllColumns,
    onDeselectAllColumns
  }: DataTranslationOptionProps) => {
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
            onSelectAll={onSelectAllColumns}
            onDeselectAll={onDeselectAllColumns}
        />
      </CardContent>
    </Card>
  )
}

export default DataTranslationOption