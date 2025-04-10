import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { cn } from '@/lib/utils'
import { Input } from './ui/input'

interface CSVTableProps {
    headers: string[]
    data: string[][]
    selectedColumns: string[]
    isEditable?: boolean
    onCellEdit?: (rowIndex: number, colIndex: number, value: string) => void
}

const CSVTable = ({ headers, data, selectedColumns, isEditable = false, onCellEdit }: CSVTableProps) => {

    const [editingCell, setEditingCell] = useState<{ row: number, col: number} | null>(null);
    const [editValue, setEditValue] = useState("");
    
    const handleCellEditClick = (rowIdx: number, colIdx: number, value: string) => {
        /* edit */
        if (isEditable && selectedColumns.includes(headers[colIdx]))
        {
            setEditingCell({ row: rowIdx, col: colIdx });
            setEditValue(value);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
    }

    const handleInputBlur = () => {
        if (editingCell && onCellEdit)
        {
            onCellEdit(editingCell.row, editingCell.col, editValue);
            setEditingCell(null);
        }
    }

    return (
        <div className="overflow-auto max-h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                {headers.map((header, index) => (
                  <TableHead key={index} className={cn(selectedColumns.includes(header) && "bg-primary/10 font-bold")}>
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className="text-center font-medium text-muted-foreground">{rowIndex + 1}</TableCell>
                  {row.map((cell, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={cn(
                        "max-w-[300px] truncate",
                        selectedColumns.includes(headers[colIndex]) && "bg-primary/5",
                        isEditable && selectedColumns.includes(headers[colIndex]) && "cursor-pointer hover:bg-primary/10",
                      )}
                      onClick={() => handleCellEditClick(rowIndex, colIndex, cell)}
                    >
                      {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                        <Input
                          value={editValue}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          autoFocus
                          className="p-0 h-auto"
                        />
                      ) : (
                        cell
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
    )
}

export default CSVTable