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

                <div>
                    <div>
                        <div>
                            <Label>Original Text</Label>
                            <div>
                                <Badge>{getLanguageName(sourceLanguage)}</Badge>
                            </div>
                        </div>
                        <Textarea />
                    </div>

                    <div>
                        <div>
                            <Label>Translation</Label>
                            <Badge>{getLanguageName(targetLanguage)}</Badge>
                        </div>
                        <Textarea />
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