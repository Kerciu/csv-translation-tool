import React from 'react'
import { Dialog } from './ui/dialog'

interface UploadConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const UploadConfirmationDialog = ({ open, onOpenChange }: UploadConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

    </Dialog>
  )
}

export default UploadConfirmationDialog