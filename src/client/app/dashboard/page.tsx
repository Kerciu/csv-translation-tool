'use client';

import CSVTable from '@/components/csv-table';
import CSVUploader from '@/components/csv-uploader'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import RowRangeSelector from '@/components/row-range-selector';
import TranslationButtons from '@/components/translation-buttons';
import TranslationOptions from '@/components/translation-options';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import UploadConfirmationDialog from '@/components/upload-confirmation-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { FileSpreadsheet, Languages, Loader2, Upload } from 'lucide-react';
import React, { useState } from 'react'



const Dashboard = () => {

    const [csvData, setCsvData] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [rowRange, setRowRange] = useState<[number, number]>([1, 1]);
    const [targetLanguage, setTargetLanguage] = useState("de");

    const [isTranslating, setTranslating] = useState(false);
    const [isTranslated, setTranslated] = useState(false);
    const [translatedData, setTranslatedData] = useState<string[][]>([]);

    const [isLoading, setLoading] = useState(false);
    const { user, isLoading: authLoading } = useAuth();

    const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
    const { toast } = useToast();

    const handleFileUpload = (uploadedData: string[][], uploadedHeaders: string[]) => {
        setCsvData(uploadedData);
        setHeaders(uploadedHeaders);
        setSelectedColumns([]);
        setSelectedRows([]);
        setRowRange([1, uploadedData.length])
        setTranslated(false);

        toast({
            title: "CSV File uploaded successfully!",
            description: `${uploadedData.length} rows and ${uploadedHeaders.length} columns detected`,
        })
    }

    const handleColumnToggle = (column: string) => {
        setSelectedColumns((prev) => (
            prev.includes(column) ? prev.filter(col => col !== column) : [...prev, column]
        ))
    }

    const handleLanguageChange = (language: string) => {
        setTargetLanguage(language);
    }

    const handleCellEdit = (rowIndex: number, colIndex: number, value: string) => {
        const newData = [...translatedData];
        newData[rowIndex][colIndex] = value;
        setTranslatedData(newData);
    }

    const handleRowRangeChange = (range: [number, number]) => {
        setRowRange(range);

        const start = range[0] - 1;
        const end = range[1] - 1;

        const rangeRows = Array.from({ length: end - start + 1 }, (_, i) => start + i)
        setSelectedRows(rangeRows);
    }

    const handleRowSelect = (rowIdx: number) => {
        setSelectedRows([rowIdx]);
        setRowRange([rowIdx + 1, rowIdx + 1]);
    }

    const handleDataReset = () => {
        setCsvData([]);
        setHeaders([]);
        setSelectedColumns([]);
        setSelectedRows([]);
        setRowRange([1, 1]);
        setTranslatedData([]);
        setTranslated(false);
        setShowUploadConfirmation(false);
    }

    const translateCSV = async () => {
        /* translate */
    }

    const downloadCSV = () => {
        /* download */
    }

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
                    <div className='space-y-6'>
                        <TranslationOptions
                            headers={headers}    
                            selectedColumns={selectedColumns} 
                            targetLanguage={targetLanguage} 
                            onColumnToggle={handleColumnToggle} 
                            onLanguageChange={handleLanguageChange} 
                        />

                        <RowRangeSelector 
                            totalRows={csvData.length}
                            selectedRange={rowRange}
                            onRangeChange={handleRowRangeChange}
                        />

                        <TranslationButtons 
                            translateCSV={translateCSV}
                            downloadCSV={downloadCSV}
                            isTranslating={isTranslating}
                            isTranslated={isTranslated}
                            selectedColumnsCount={selectedColumns.length}
                        />

                        <div className='border rounded-lg overflow-hidden'>
                            <CSVTable
                                headers={headers}
                                data={csvData}
                                selectedColumns={selectedColumns}
                                selectedRows={selectedRows}
                                isEditable={isTranslated}
                                onCellEdit={handleCellEdit}
                                onRowSelect={handleRowSelect}
                            />
                        </div>
                    </div>
                    :
                    <CSVUploader onFileUpload={handleFileUpload}/>
                }
                </CardContent>

                <CardFooter className='flex justify-center text-sm text-muted-foreground'>
                    {
                        csvData.length > 0 &&
                        <Button
                            variant='ghost'
                            onClick={() => setShowUploadConfirmation(true)}
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

        <UploadConfirmationDialog
            open={showUploadConfirmation}
            onOpenChange={setShowUploadConfirmation}
        />
        </div>
    )
}

export default Dashboard