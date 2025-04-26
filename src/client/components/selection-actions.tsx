import React from 'react'
import { Button } from './ui/button'

interface SelectedActionsProps {
    selectedCount: number
    totalCount: number
}

const SelectionActions = ({ selectedCount, totalCount }: SelectedActionsProps) => {
  return (
    <div>
        <span>
            {selectedCount} out of {totalCount} selected
        </span>

        <div>
            <Button>Deselect All</Button>
            <Button>Select All</Button>
        </div>
    </div>
  )
}

export default SelectionActions