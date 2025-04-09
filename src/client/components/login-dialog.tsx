import React, { useEffect, useState } from 'react'
import { Dialog, DialogHeader } from '@/components/ui/dialog'
import { DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { Loader2 } from 'lucide-react'
import LoadingState from './loading-state'

interface LoginDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

const LoginDialog = ({isOpen, onOpenChange}: LoginDialogProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isProcessing = isLoading || isSubmitting;

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(newOpen) => {
                if (!isProcessing) 
                    onOpenChange(newOpen)
                }
            }
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Welcome to the CSV Translator</DialogTitle>
                    <DialogDescription>Sign in to access the full translation features</DialogDescription>
                </DialogHeader>

                {isProcessing ? (
                    <LoadingState message={isSubmitting ? "Processing your request..." : "Loading..."}/>
                ) : (
                    <>



                    </>
                    )
                }

            </DialogContent>
        </Dialog>
    )
    }

export default LoginDialog