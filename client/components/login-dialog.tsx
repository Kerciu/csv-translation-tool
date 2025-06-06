import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import LoadingState from './loading-state';
import OAuthButtons from './oauth-buttons';
import LoginForm from './login-form';
import { Tabs, TabsContent, TabsList } from './ui/tabs';
import RegisterForm from './register-form';
import { TabsTrigger } from '@radix-ui/react-tabs';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog = ({ isOpen, onOpenChange }: LoginDialogProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, loginWithProvider, isLoading } = useAuth();
  const { toast } = useToast();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (activeTab === 'login') {
        await login(email, password);
        toast({
          title: 'Login successful',
          description: 'Successfully logged in, welcome back!',
        });
        onOpenChange(false);
        setIsSubmitting(false);
        router.push('/dashboard');
      } else {
        await register(username, email, password);
        toast({
          title: 'Registration successful',
          description: 'Registered successfully!',
        });
        setIsSubmitting(false);
        setActiveTab('login');
      }
    } catch (error) {
      toast({
        title: activeTab === 'login' ? 'Login failed' : 'Registration failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setIsSubmitting(true);

    try {
      await loginWithProvider(provider);
      toast({
        title: 'Login successful',
        description: `Successfully logged in with ${provider}`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Login failed',
        description: `Could not log in with ${provider}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isSubmitting && !isOpen) {
      setUsername('');
      setEmail('');
      setPassword('');
      setActiveTab('login');
    }
  }, [isOpen, isLoading, isSubmitting]);

  const isProcessing = isLoading || isSubmitting;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(newOpen) => {
        if (!isProcessing) onOpenChange(newOpen);
      }}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Welcome to the CSV Translator</DialogTitle>
          <DialogDescription>Sign in to access the full translation features</DialogDescription>
        </DialogHeader>

        {isProcessing ? (
          <LoadingState message={isSubmitting ? 'Processing your request...' : 'Loading...'} />
        ) : (
          <>
            <OAuthButtons handleOAuthLogin={handleOAuthLogin} />

            <Tabs
              defaultValue='login'
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as 'login' | 'register')}
            >
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='login'>Login</TabsTrigger>
                <TabsTrigger value='register'>Register</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <TabsContent value='login' className='space-y-4 py-4'>
                  <LoginForm
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                  />
                </TabsContent>

                <TabsContent value='register' className='space-y-4 py-4'>
                  <RegisterForm
                    username={username}
                    email={email}
                    password={password}
                    setUsername={setUsername}
                    setEmail={setEmail}
                    setPassword={setPassword}
                  />
                </TabsContent>
              </form>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
