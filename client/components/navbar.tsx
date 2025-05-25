'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { FileSpreadsheet, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from './ui/skeleton';
import LoginDialog from './login-dialog';
import { ModeToggle } from './mode-toggle';

const Navbar = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const { user, logout, isLoading } = useAuth();

  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  return (
    <header className='border-b'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <Link href='/' className='flex items-center gap-2'>
          <FileSpreadsheet className='size-6' />
          <span className='text-x1 font-bold'>CSV Translation Tool</span>
        </Link>

        <div className='flex items-center gap-4'>
          <ModeToggle />

          {isLoading ? (
            <Skeleton className='size-10 rounded-full' />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative size-10 rounded-full p-0'>
                  <Avatar className='size-10'>
                    <AvatarFallback className='flex size-full items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary'>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='z-50 min-w-[220px] rounded-md border bg-popover p-2 shadow-md'
              >
                <div className='mb-2 flex items-center gap-3 border-b p-2'>
                  <Avatar className='size-8'>
                    <AvatarFallback className='flex size-full items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary'>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col space-y-0.5'>
                    <p className='text-sm font-medium leading-none'>{user.name}</p>
                    <p className='text-xs text-muted-foreground'>{user.email}</p>
                    {user.provider && (
                      <p className='text-xs text-muted-foreground'>
                        via {user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}
                      </p>
                    )}
                  </div>
                </div>

                {!isDashboard && (
                  <DropdownMenuItem
                    asChild
                    className='flex cursor-pointer items-center rounded-md p-2 text-sm hover:bg-muted'
                  >
                    <Link href='/dashboard' className='w-full'>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={logout}
                  className='flex cursor-pointer items-center rounded-md p-2 text-sm hover:bg-muted'
                >
                  <LogOut className='mr-2 size-4' />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setShowLoginDialog(true)} variant='default' className='gap-2'>
              <User className='size-4' />
              Sign In
            </Button>
          )}
        </div>
      </div>

      <LoginDialog isOpen={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </header>
  );
};

export default Navbar;
