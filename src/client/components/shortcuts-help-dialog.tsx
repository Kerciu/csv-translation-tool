import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import shortcuts from '@/data/shortcuts'
import { HelpCircle } from 'lucide-react'

const ShortcutsHelpDialog = () => {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant='outline' size='icon' className='h-9 w-9'>
                <HelpCircle className='h-4 w-4'/>
                <span className='sr-only'>Keyboard shortcuts</span>
            </Button>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[600px]'>
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
                        <TableHead className='w-[200px]'>Action</TableHead>
                        <TableHead className='w-[150px]'>Shortcut</TableHead>
                        <TableHead>Description</TableHead>
                    </TableHeader>

                    <TableBody>
                        {shortcuts.map((shortcut) => (
                            <TableRow key={shortcut.action}>
                                <TableCell className='font-medium'>{shortcut.action}</TableCell>
                                <TableCell>
                                    <kbd>{shortcut.shortcut}</kbd>
                                </TableCell>
                                <TableCell>{shortcut.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default ShortcutsHelpDialog