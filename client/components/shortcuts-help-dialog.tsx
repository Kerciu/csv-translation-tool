import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import shortcuts from '@/data/shortcuts';
import { HelpCircle } from 'lucide-react';

interface ShortcutsHelpDialogProps {
  trigger: React.ReactNode;
}

const ShortcutsHelpDialog = ({ trigger }: ShortcutsHelpDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline' size='icon' className='size-9'>
            <HelpCircle className='size-4' />
            <span className='sr-only'>Usage Tips & Shortcuts</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Quick Usage & Shortcuts Guide</DialogTitle>

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
                    <kbd
                      className='pointer-events-none inline-flex h-5 select-none items-center
                                        gap-1 rounded border bg-muted px-1.5 font-mono text-[10px]
                                        font-medium text-muted-foreground'
                    >
                      {shortcut.shortcut}
                    </kbd>
                  </TableCell>
                  <TableCell>{shortcut.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutsHelpDialog;
