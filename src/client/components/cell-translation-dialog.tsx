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
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <span>
                    Cell Translation - Row {rowIdx + 1}, {columnName}
                    </span>
                </DialogTitle>
                <DialogDescription>
                    Review and edit the translation for this cell.
                </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <Label htmlFor="original-value">Original Text</Label>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{getLanguageName(sourceLanguage)}</Badge>
                    </div>
                    </div>
                    <Textarea id="original-value" value={originalValue} readOnly className="h-20 resize-none bg-muted" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <Label htmlFor="translated-value">Translation</Label>
                    <Badge>{getLanguageName(targetLanguage)}</Badge>
                    </div>
                    <Textarea
                    id="translated-value"
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className={`h-28 resize-none`}
                    placeholder="Enter translation..."
                    />
                </div>
                </div>

                <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={handleRevert} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Revert to Original
                </Button>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                    </Button>
                    <Button onClick={handleApprove} className="gap-2">
                    <Check className="h-4 w-4" />
                    Approve & Save
                    </Button>
                </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CellTranslationDialog