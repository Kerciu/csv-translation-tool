'use client';

import CSVTable from '@/components/csv-table';
import CSVUploader from '@/components/csv-uploader'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'



const Dashboard = () => {

    const [fileUploaded, setFileUploaded] = useState<boolean>(false);
    
    const [isLoading, setLoading] = useState(true);
    const { user, isLoading: authLoading } = useAuth();

    const handleFileUpload = () => {}

    /* DEBUG: Mock Data */
    const headers = ["Name", "Age", "Country", "Email"]
    const data = [
        ["John Doe", "30", "USA", "john.doe@example.com"],
        ["Jane Smith", "25", "Canada", "jane.smith@example.com"],
        ["Sam Brown", "28", "UK", "sam.brown@example.com"],
        ["Emily White", "22", "Australia", "emily.white@example.com"]
    ]

    const selectedColumns = ["Name", "Age", "Email"]

    const handleCellEdit = (rowIndex: number, colIndex: number, value: string) => {
        console.log(`Updated cell at row ${rowIndex + 1}, column ${colIndex}: ${value}`)
    }
    /* DEBUG */

    if (isLoading || authLoading)
    {
        return <div className="flex min-h-screen flex-col">
            <Navbar />
            <main>
                <div>
                    <Loader2/>
                    <p>Loading your dashboard...</p>
                </div>
            </main>

            <Footer/>
        </div>
    }

    return (
        <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
            {fileUploaded ?
                <CSVTable
                    headers={headers} 
                    data={data}
                    selectedColumns={selectedColumns} 
                    onCellEdit={handleCellEdit}
                />
                :
                <CSVUploader onFileUpload={handleFileUpload}/>
            }
        </main>

        <Footer/>
        </div>
    )
}

export default Dashboard