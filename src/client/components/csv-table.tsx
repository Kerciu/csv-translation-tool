import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

interface CSVTableProps {
    headers: string[]
    data: string[][]
    selectedColumns: string[]
    isEditable?: boolean
    onCellEdit?: (rowIndex: number, colIndex: number, value: string) => void
}

const CSVTable = ({ headers, data, selectedColumns, isEditable = false, onCellEdit }: CSVTableProps) => {
  return (
    <div className='overflow-auto max-h-[600px]'>
        <Table >
            <TableHeader className='sticky top-0 bg-background z-10'>
                <TableRow>
                    <TableHead className='w-12 text-center'>#</TableHead>
                    {headers.map((header, idx) => (
                        <TableHead key={idx}>{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    data.map((row, rowIdx) => (
                        <TableRow>
                            <TableCell className='text-center font-medium text-muted-foreground'>{rowIdx + 1}</TableCell>
                            {
                            row.map((cell, colIdx) => (
                                <TableCell
                                    key={colIdx}
                                    className='max-w-[300px] truncate'
                                >
                                    {cell}
                                </TableCell>
                            ))
                            }
                        </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default CSVTable