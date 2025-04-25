import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Check, RotateCcw, X } from 'lucide-react'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { getLanguageName } from '@/utils/getLanguageName'
import { Textarea } from './ui/textarea'

interface CellTranslationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    rowIdx: number
    colIdx: number
    columnName: string
    originalValue: string
    translatedValue: string
    sourceLanguage: string
    targetLanguage: string
    onRevert: () => void
    onApprove: (value: string) => void
}

const CellTranslationDialog = ({
    open,
    onOpenChange,
    rowIdx,
    colIdx,
    columnName,
    originalValue,
    translatedValue,
    sourceLanguage,
    targetLanguage,
    onRevert,
    onApprove
    }: CellTranslationDialogProps) => {

    const [editedValue, setEditedValue] = useState(translatedValue);

    const handleRevert = () => {
        onRevert();
        onOpenChange(false);
    }

    const handleApprove = () => {
        onApprove(editedValue);
        onOpenChange(false);
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Cell Translation - Row {rowIdx + 1}, {columnName}
                    </DialogTitle>
                    <DialogDescription>
                        Review and edit the translation for this cell.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                        <Label>Original Text ({getLanguageName(sourceLanguage)})</Label>
                        <Badge variant="outline">Source</Badge>
                        </div>
                        <Textarea
                        value={originalValue}
                        readOnly
                        className="resize-none bg-muted/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                        <Label>Translation ({getLanguageName(targetLanguage)})</Label>
                        <Badge variant="outline">Target</Badge>
                        </div>
                        <Textarea
                        value={editedValue}
                        onChange={(e) => setEditedValue(e.target.value)}
                        className="min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleRevert}>
                        <RotateCcw />
                        Revert to Original
                    </Button>

                    <div>
                        <Button onClick={() => onOpenChange(false)}>
                            <X />
                            Cancel
                        </Button>

                        <Button onClick={handleApprove}>
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