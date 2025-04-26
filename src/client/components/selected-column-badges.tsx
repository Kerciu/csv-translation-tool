import React from 'react'

interface SelectedColumnBadgesProps {
  selectedColumns: string[]
  onRemove: (column: string) => void
}

const SelectedColumnBadges = ({ selectedColumns, onRemove }: SelectedColumnBadgesProps) => {

  if (selectedColumns.length === 0) return null;

  return (
    <div>SelectedColumnBadges</div>
  )
}

export default SelectedColumnBadges