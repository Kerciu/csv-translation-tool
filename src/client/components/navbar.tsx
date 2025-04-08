"use client"

import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { FileSpreadsheet } from 'lucide-react';
import Link from "next/link";
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const Navbar = () => {

    const [showLoginDialog, setShowLoginDialog] = useState(false);

    const [user, setUser] = useState({
        name: "Kacper"
    }); /* This will be replaced by this thing below TODO*/

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

            <div className='flex items-center gap-4'>
                <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className='relative h-10 w-19 rounded-full'>
                            <Avatar className='h-10 w-10'>
                                <AvatarFallback className='bg-primary/10 text-primary'>
                                    {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>

                </DropdownMenu>
            </div>

        </div>
    </header>
  )
}

export default Navbar;