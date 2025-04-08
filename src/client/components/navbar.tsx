"use client"

import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { FileSpreadsheet } from 'lucide-react';
import Link from "next/link";
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

const Navbar = () => {

    const [user, setUser] = useState({
        name: "Kacper"
    });

  return (
    <header>
        <div>

            <Link href='/'>
                <FileSpreadsheet/>
                <span>CSV Translation Tool</span>
            </Link>

            <div>
                <DropdownMenu>

                    <DropdownMenuTrigger asChild>

                        <Button variant="ghost">
                            <Avatar>
                                <AvatarFallback>
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