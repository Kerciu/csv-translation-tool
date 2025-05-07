import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle, Check, RotateCcw, X } from 'lucide-react';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { getLanguageName } from '@/utils/getLanguageName';
import { Textarea } from './ui/textarea';

interface CellTranslationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rowIdx: number;
  columnName: string;
  originalValue: string;
  translatedValue: string;
  sourceLanguage: string;
  targetLanguage: string;
  onRevert: () => void;
  onApprove: (value: string) => void;
  hasTranslationError?: boolean;
}

const CellTranslationDialog = ({
  open,
  onOpenChange,
  rowIdx,
  columnName,
  originalValue,
  translatedValue,
  sourceLanguage,
  targetLanguage,
  onRevert,
  onApprove,
  hasTranslationError,
}: CellTranslationDialogProps) => {
  const [editedValue, setEditedValue] = useState(translatedValue);

  const handleRevert = () => {
    onRevert();
    onOpenChange(false);
  };

  const handleApprove = () => {
    onApprove(editedValue);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {hasTranslationError && <AlertTriangle className='size-5 text-destructive' />}
            <span>
              Cell Translation - Row {rowIdx + 1}, {columnName}
            </span>
          </DialogTitle>
          <DialogDescription>
            Review and edit the translation for this cell.
            {hasTranslationError && (
              <div className='mt-2 flex items-center gap-2 text-destructive'>
                <AlertTriangle className='size-4' />
                <span>
                  Warning: There may be an issue with this translation. Please review carefully.
                </span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='original-value'>Original Text</Label>
              <div className='flex items-center gap-2'>
                <Badge variant='outline'>{getLanguageName(sourceLanguage)}</Badge>
              </div>
            </div>
            <Textarea
              id='original-value'
              value={originalValue}
              readOnly
              className='h-20 resize-none bg-muted'
            />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='translated-value'>Translation</Label>
              <Badge>{getLanguageName(targetLanguage)}</Badge>
            </div>
            <Textarea
              id='translated-value'
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className={`h-28 resize-none ${hasTranslationError ? 'border-destructive' : ''}`}
              placeholder='Enter translation...'
            />
          </div>
        </div>

        <DialogFooter className='flex justify-between'>
          <Button variant='outline' onClick={handleRevert} className='gap-2'>
            <RotateCcw className='size-4' />
            Revert to Original
          </Button>
          <div className='flex gap-2'>
            <Button variant='ghost' onClick={() => onOpenChange(false)} className='gap-2'>
              <X className='size-4' />
              Cancel
            </Button>
            <Button onClick={handleApprove} className='gap-2'>
              <Check className='size-4' />
              Approve & Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CellTranslationDialog;
