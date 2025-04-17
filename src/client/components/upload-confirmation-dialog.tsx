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
            You are about to clear your current work. Would you like to download your current file before proceeding?
          </DialogDescription>

        </DialogHeader>

        <div className="py-2">
          <p className="text-sm text-muted-foreground">
            Uploading a new file will clear all your current data, including any translations you've made.
          </p>
        </div>

      </DialogContent>
    </Dialog>
  )
}

export default UploadConfirmationDialog