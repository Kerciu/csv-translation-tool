import React from 'react'
import { Dialog, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

const ShortcutsHelpDialog = () => {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button>Keyboard shortcuts</Button>
        </DialogTrigger>
    </Dialog>
  )
}

export default ShortcutsHelpDialog