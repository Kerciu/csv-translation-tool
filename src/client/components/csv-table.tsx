import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import CellTranslationDialog from './cell-translation-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { AlertTriangle } from 'lucide-react'

interface CSVTableProps {
    headers: string[]
    data: string[][]
    selectedColumns: string[]
    selectedRows: number[]
    isEditable?: boolean
    onCellEdit?: (rowIndex: number, colIndex: number, value: string) => void
    onRowSelect?: (rowIndex: number, isShiftKey: boolean, isCtrlKey: boolean) => void
    originalData?: string[][]
    sourceLanguage?: string
    targetLanguage?: string
    translationErrors: {row: number, col: number}[]
    onCellRevert?: (rowIndex: number, colIndex: number) => void
}

const CSVTable = ({
      headers,
      data,
      selectedColumns,
      selectedRows,
      isEditable = false,
      onCellEdit,
      onRowSelect,
      originalData,
      sourceLanguage = "en",
      targetLanguage = "en",
      translationErrors,
      onCellRevert,
    }: CSVTableProps) => {

    const [editingCell, setEditingCell] = useState<{ row: number, col: number} | null>(null);
    const [editValue, setEditValue] = useState("");

    const [showTranslationDialog, setShowTranslationDialog] = useState(false);
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number; value: string } | null>(null)

    const handleCellEditClick = (rowIdx: number, colIdx: number, value: string) => {
        /* edit */
        if (isEditable &&
          selectedColumns.includes(headers[colIdx]) &&
          selectedRows.includes(rowIdx))
        {
            setShowTranslationDialog(true);
            setSelectedCell({
              row: rowIdx,
              col: colIdx,
              value,
            })
            setEditValue(value);
        }
    }

    const handleRowClick = (rowIndex: number, e: React.MouseEvent) => {
      if (onRowSelect)
      {
        onRowSelect(rowIndex, e.shiftKey, e.ctrlKey);
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter')
        {
            handleInputBlur();
        }
        else if (e.key === 'Escape')
        {
            setEditingCell(null);
        }
    }

    const handleApproveTranslation = (value: string) => {
      if (selectedCell && onCellEdit) {
        onCellEdit(selectedCell.row, selectedCell.col, value)
      }
    }

    const handleRevertTranslation = () => {
      if (selectedCell && onCellRevert) {
        onCellRevert(selectedCell.row, selectedCell.col)
      }
    }

    const hasCellTranslationError = (rowIndex: number, colIndex: number) => {
      return translationErrors.some((error) => error.row === rowIndex && error.col === colIndex)
    }

    useEffect(() => {
      if (!showTranslationDialog) {
        setSelectedCell(null);
      }
    }, [showTranslationDialog]);

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
            <TableRow key={rowIndex} className={cn(selectedRows.includes(rowIndex) && "bg-secondary/20")}>
              <TableCell
                className={cn(
                  "text-center font-medium text-muted-foreground cursor-pointer hover:bg-secondary/10",
                  selectedRows.includes(rowIndex) && "bg-secondary/30",
                )}
                onClick={(e) => handleRowClick(rowIndex, e)}
              >
                {rowIndex + 1}
              </TableCell>
              {row.map((cell, colIndex) => {
                const hasError = hasCellTranslationError(rowIndex, colIndex);
                return (
                  <TableCell
                    key={colIndex}
                    className={cn(
                      "max-w-[300px] truncate",
                      selectedColumns.includes(headers[colIndex]) && "bg-primary/5",
                      isEditable &&
                      selectedColumns.includes(headers[colIndex]) &&
                      selectedRows.includes(rowIndex) &&
                      "cursor-pointer hover:bg-primary/10",
                      selectedRows.includes(rowIndex) && selectedColumns.includes(headers[colIndex]) && "bg-primary/20",
                      hasError && "bg-destructive/5",
                    )}
                    onClick={() => handleCellEditClick(rowIndex, colIndex, cell)}
                  >
                    <div className="flex items-center gap-1">
                    {hasError && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Translation may be inaccurate - language detection issue</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                        <Input
                          value={editValue}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className="p-0 h-auto"
                        />
                      ) : (
                        <span className={hasError ? "text-destructive" : ""}>{cell}</span>
                      )}
                    </div>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedCell && (
        <CellTranslationDialog
          open={showTranslationDialog}
          onOpenChange={setShowTranslationDialog}
          rowIdx={selectedCell.row}
          colIdx={selectedCell.col}
          columnName={headers[selectedCell.col]}
          originalValue={originalData ? originalData[selectedCell.row][selectedCell.col] : ""}
          translatedValue={selectedCell.value}
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          onApprove={handleApproveTranslation}
          onRevert={handleRevertTranslation}
        />
      )}
    </div>
    )
}

export default CSVTable