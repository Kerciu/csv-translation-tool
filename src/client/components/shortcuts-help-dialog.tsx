import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Table, TableHead, TableHeader } from './ui/table'

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

            <div className='max-h-[60vh] overflow-auto pr-2'>
                <Table>
                    <TableHeader>
                        <TableHead>Action</TableHead>
                        <TableHead>Shortcut</TableHead>
                        <TableHead>Description</TableHead>
                    </TableHeader>
                </Table>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default ShortcutsHelpDialog