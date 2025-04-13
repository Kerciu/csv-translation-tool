'use client';

import CSVTable from '@/components/csv-table';
import CSVUploader from '@/components/csv-uploader'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { FileSpreadsheet, Loader2, Upload } from 'lucide-react';
import React, { useState } from 'react'



const Dashboard = () => {

    /* DEBUG: Mock Data */
    const headersMock = ["Name", "Age", "Country", "Email"]
    const dataMock = [
        ["John Doe", "30", "USA", "john.doe@example.com"],
        ["Jane Smith", "25", "Canada", "jane.smith@example.com"],
        ["Sam Brown", "28", "UK", "sam.brown@example.com"],
        ["Emily White", "22", "Australia", "emily.white@example.com"]
    ]
    const selectedColumnsMock = ["Name", "Age", "Email"]

    const [csvData, setCsvData] = useState<string[][]>(dataMock);
    const [headers, setHeaders] = useState<string[]>(headersMock);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(selectedColumnsMock);
    
    const [isLoading, setLoading] = useState(false);
    const { user, isLoading: authLoading } = useAuth();


    const handleFileUpload = () => {}

    

    const handleCellEdit = (rowIndex: number, colIndex: number, value: string) => {
        console.log(`Updated cell at row ${rowIndex + 1}, column ${colIndex}: ${value}`)
    }
    /* DEBUG */

    if (isLoading || authLoading)
    {
        return <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className='container mx-auto py-8 px-4 flex-1 flex items-center justify-center'>
                <div className='flex flex-col items-center gap-4'>
                    <Loader2 className='h-12 w-12 text-primary animate-spin'/>
                    <p className='text-lg text-muted-foreground'>Loading your dashboard...</p>
                </div>
            </main>

            <Footer/>
        </div>
    }

    return (
        <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="container mx-auto py-8 px-4 flex-1">
            <Card className='w-full'>
                <CardHeader className='text-center'>
                    <CardTitle className='text-3x1 flex items-center justify-center gap-4'>
                        <FileSpreadsheet className='w-8 h-8'/>
                        CSV Translation Tool
                    </CardTitle>
                    <CardDescription>
                        Upload a CSV file, select columns to translate, and download the translated file
                    </CardDescription>
                </CardHeader>
                <CardContent>
                {csvData.length > 0 ?
                    <CSVTable
                        headers={headers} 
                        data={csvData}
                        selectedColumns={selectedColumns} 
                        onCellEdit={handleCellEdit}
                    />
                    :
                    <CSVUploader onFileUpload={handleFileUpload}/>
                }
                </CardContent>

                <CardFooter className='flex justify-center text-sm text-muted-foreground'>
                    {
                        csvData.length > 0 &&
                        <Button
                            variant='ghost'
                            onClick={() => {
                                setCsvData([])
                            }}
                            className='gap-2'
                        >
                            <Upload className='h-4 w-4'/>
                            Upload a different file
                        </Button>
                    }
                </CardFooter>
            </Card>
        </main>

        <Footer/>
        </div>
    )
}

export default Dashboard