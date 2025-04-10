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
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    {headers.map((header, idx) => (
                        <TableHead key={idx}>{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    data.map((row, rowIdx) => (
                        <TableRow>
                            <TableCell>{rowIdx + 1}</TableCell>
                            {
                            row.map((cell, colIdx) => (
                                <TableCell key={colIdx}>{cell}</TableCell>
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