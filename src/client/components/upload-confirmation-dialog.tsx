import React from 'react'
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { AlertTriangle, Download, Upload } from 'lucide-react'
import { Button } from './ui/button'

interface UploadConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload: () => void
  onConfirm: () => void
}

const UploadConfirmationDialog = ({ open, onOpenChange, onDownload, onConfirm }: UploadConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg w-full px-2'>

        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-amber-500'/>
            <span>Upload New File</span>
          </DialogTitle>

          <DialogDescription className='text-sm'>
            You are about to clear your current work. Would you like to download your current file before proceeding?
          </DialogDescription>

        </DialogHeader>

        <div className="py-2">
          <p className="text-sm text-muted-foreground">
            Uploading a new file will clear all your current data, including any translations you've made.
          </p>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={onDownload}
          >
            <Download className='w-4 h-4 mr-2'/>
            Download Current File
          </Button>

          <Button
            onClick={onConfirm}
          >
            <Upload className='w-4 h-4 mr-2'/>
            Proceed to Upload
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}

export default UploadConfirmationDialog