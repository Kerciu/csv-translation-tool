import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

const ShortcutsHelpDialog = () => {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button>Keyboard shortcuts</Button>
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Keyboard Shortcuts
                </DialogTitle>

                <DialogDescription>
                    Use these keyboard shortcuts to work more efficiently with the CSV translator.
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default ShortcutsHelpDialog