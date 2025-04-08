import { FileSpreadsheet } from 'lucide-react';
import Link from "next/link";
import React from 'react'

const Navbar = () => {
  return (
    <header>
        <div>

            <Link href='/'>
                <FileSpreadsheet/>
                <span>CSV Translation Tool</span>
            </Link>

        </div>
    </header>
  )
}

export default Navbar;