import React from 'react'

interface DataTranslationOptionProps {
    headers: string[]
    selectedColumns: string[]
    onColumnToggle: (column: string) => void
}

const DataTranslationOption = ({ headers, selectedColumns, onColumnToggle }: DataTranslationOptionProps) => {
  return (
    <div>DataTranslationOption</div>
  )
}

export default DataTranslationOption