import React, { useEffect } from 'react'
import { Dialog, DialogHeader } from '@/components/ui/dialog'
import { DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { Loader2 } from 'lucide-react'

interface LoginDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

const LoginDialog = ({isOpen, onOpenChange}: LoginDialogProps) => {

    const [isLoading, setIsLoading] = useEffect(false);
    const [isSubmitting, setIsSubmitting] = useEffect(false);

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
                    <div>
                        <Loader2 />
                        <p>{isSubmitting ? "Processing your request..." : "Loading"}</p>
                    </div>
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