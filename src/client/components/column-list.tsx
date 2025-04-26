import React from 'react'

interface ColumnListProps {
  headers: string[]
  selectedColumns: string[]
  onSelect: (column: string, e?: React.MouseEvent) => void
}

const ColumnList = ({ headers, selectedColumns, onSelect }: ColumnListProps) => {
  return (
    <div>

    </div>
  )
}

export default ColumnList