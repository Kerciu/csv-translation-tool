import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Check, RotateCcw, X } from 'lucide-react'

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

                <DialogFooter>
                    <Button>
                        <RotateCcw />
                        Revert to Original
                    </Button>

                    <div>
                        <Button>
                            <X />
                            Cancel
                        </Button>

                        <Button>
                            <Check />
                            Approve & Save
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CellTranslationDialog