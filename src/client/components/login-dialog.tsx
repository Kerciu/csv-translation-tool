import React, { useEffect, useState } from 'react'
import { Dialog, DialogHeader } from '@/components/ui/dialog'
import { DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { Loader2 } from 'lucide-react'
import LoadingState from './loading-state'
import OAuthButtons from './oauth-buttons'
import LoginForm from './login-form'
import { Tabs, TabsContent, TabsList } from './ui/tabs'
import RegisterForm from './register-form'
import { TabsTrigger } from '@radix-ui/react-tabs'

interface LoginDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

const LoginDialog = ({isOpen, onOpenChange}: LoginDialogProps) => {

    const [activeTab, setActiveTab] = useState<"login" | "register">("login");

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
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle className='text-2x1'>Welcome to the CSV Translator</DialogTitle>
                    <DialogDescription>Sign in to access the full translation features</DialogDescription>
                </DialogHeader>

                {isProcessing ? (
                    <LoadingState message={isSubmitting ? "Processing your request..." : "Loading..."}/>
                ) : (
                    <>
                        <OAuthButtons />

                        <Tabs
                            defaultValue='login'
                            value={activeTab}
                            onValueChange={(val) => setActiveTab(val as "login" | "register")}
                        >
                            <TabsList className='grid w-full grid-cols-2'>
                                <TabsTrigger value='login'>Login</TabsTrigger>
                                <TabsTrigger value='register'>Register</TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value='login'
                                className='space-y-4 py-4'
                            >
                                <LoginForm />
                            </TabsContent>

                            <TabsContent
                                value='register'
                                className='space-y-4 py-4'
                            >
                                <RegisterForm />
                            </TabsContent>
                        </Tabs>
                    </>
                    )
                }

            </DialogContent>
        </Dialog>
    )
    }

export default LoginDialog