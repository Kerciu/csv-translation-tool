"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { FileSpreadsheet, LogOut, User } from 'lucide-react';
import Link from "next/link";
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from './ui/skeleton';
import LoginDialog from './login-dialog';
import { ModeToggle } from './mode-toggle';

const Navbar = () => {

    const [showLoginDialog, setShowLoginDialog] = useState(false);

    /* DEBUG */
    const [user, setUser] = useState({
        name: "Kacper",
        email: "Kerciuuu@gmail.com",
        provider: "GitHub"
    });
    const [isLoading , setLoading] = useState(false);
    const logout = () => {}
    /* This will be replaced by this thing below TODO*/

    // const { user, logout, isLoading } = useAuth();

    const pathname = usePathname();
    const isDashboard = pathname === '/dashboard';

  return (
    <header className='border-b'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>

            <Link href='/' className='flex items-center gap-2'>
                <FileSpreadsheet className='h-6 w-6'/>
                <span className='text-x1 font-bold'>CSV Translation Tool</span>
            </Link>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="z-50 min-w-[220px] rounded-md border bg-popover p-2 shadow-md"
              >
                <div className="flex items-center gap-3 px-2 py-2 border-b mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.provider && (
                      <p className="text-xs text-muted-foreground">
                        via {user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}
                      </p>
                    )}
                  </div>
                </div>

                {!isDashboard && (
                  <DropdownMenuItem asChild className="cursor-pointer px-2 py-2 text-sm rounded-md hover:bg-muted flex items-center">
                    <Link href="/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer px-2 py-2 text-sm rounded-md hover:bg-muted flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setShowLoginDialog(true)} variant="default" className="gap-2">
              <User className="h-4 w-4" />
              Sign In
            </Button>
          )}
            </div>
        </div>

        <LoginDialog isOpen={showLoginDialog} onOpenChange={setShowLoginDialog}/>
    </header>
  )
}

export default Navbar;