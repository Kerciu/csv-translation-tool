import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { AlertTriangle } from 'lucide-react'

interface UploadConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

const UploadConfirmationDialog = ({ open, onOpenChange, onConfirm }: UploadConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>

        <DialogHeader>
            <AlertTriangle className='w-5 h-5'/>
            <span>Upload New File</span>
          <DialogTitle>

          </DialogTitle>

          <DialogDescription>

          </DialogDescription>

        </DialogHeader>

      </DialogContent>
    </Dialog>
  )
}

export default UploadConfirmationDialog