import React from 'react'
import { Dialog } from './ui/dialog'

interface UploadConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

const UploadConfirmationDialog = ({ open, onOpenChange, onConfirm }: UploadConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

    </Dialog>
  )
}

export default UploadConfirmationDialog