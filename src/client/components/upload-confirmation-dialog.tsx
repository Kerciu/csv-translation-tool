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
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className='w-full max-w-lg px-4 min-w-[300px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-amber-500'/>
            <span>Upload New File</span>
          </DialogTitle>

          <DialogDescription className='text-sm break-words'>
            You are about to clear your current work. Would you like to download your current file before proceeding?
          </DialogDescription>

          <div className="my-2 border-t border-muted" />

          <p className="text-sm text-muted-foreground break-words mt-2">
            Uploading a new file will clear all your current data, including any translations you've made.
          </p>

        </DialogHeader>

        <DialogFooter className='grid sm:grid-cols-3 gap-2 mt-2'>
          <Button
            variant='secondary'
            onClick={onDownload}
            className="w-full sm:w-auto"
          >
            <Download className='w-4 h-4 mr-2'/>
            Download File
          </Button>

          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            <Upload className='w-4 h-4 mr-2'/>
            Proceed
          </Button>

          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UploadConfirmationDialog