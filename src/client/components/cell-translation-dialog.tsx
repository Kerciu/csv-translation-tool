import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'

interface CellTranslationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    rowIdx: number
    columnName: string
}

const CellTranslationDialog = ({
    open,
    onOpenChange,
    rowIdx,
    columnName
    }: CellTranslationDialogProps) => {

    return (
        <Dialog>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Cell Translation - Row {rowIdx + 1}, {columnName}
                    </DialogTitle>
                    <DialogDescription>
                        Review and edit the translation for this cell.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CellTranslationDialog