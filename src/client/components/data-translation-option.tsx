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
          <CardTitle>Select Columns to Translate</CardTitle>
      </CardHeader>

      <CardContent>
          {headers.map((header, idx) => (
            <div>
              <Checkbox />
              <Label>
                {header}
              </Label>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}

export default DataTranslationOption