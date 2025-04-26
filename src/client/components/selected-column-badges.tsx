import React from 'react'
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface SelectedColumnBadgesProps {
  selectedColumns: string[]
  onRemove: (column: string) => void
}

const SelectedColumnBadges = ({ selectedColumns, onRemove }: SelectedColumnBadgesProps) => {

  if (selectedColumns.length === 0) return null;

  return (
    <ScrollArea>
      {selectedColumns.map((column) => (
        <Badge>
          <span>{column}</span>
          <X />
        </Badge>
      ))}
    </ScrollArea>
  )
}

export default SelectedColumnBadges