'use client';

import CSVTable from '@/components/csv-table';
import CSVUploader from '@/components/csv-uploader'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import RowRangeSelector from '@/components/row-range-selector';
import ShortcutsHelpDialog from '@/components/shortcuts-help-dialog';
import TranslationButtons from '@/components/translation-buttons';
import TranslationOptions from '@/components/translation-options';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import UploadConfirmationDialog from '@/components/upload-confirmation-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { LanguageType } from '@/lib/types';
import { getLanguageName } from '@/utils/getLanguageName';
import { FileSpreadsheet, HelpCircle, Loader2, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const Dashboard = () => {

    const [csvData, setCsvData] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [rowRange, setRowRange] = useState<[number, number]>([1, 1]);
    const [targetLanguage, setTargetLanguage] = useState("de");
    const [sourceLanguage, setSourceLanguage] = useState("en");

    const [isTranslating, setTranslating] = useState(false);
    const [isTranslated, setTranslated] = useState(false);
    const [translatedData, setTranslatedData] = useState<string[][]>([]);

    const [translationErrors, setTranslationErrors] = useState<{row: number, col: number }[]>([]);
    const [hightlightErrors, setHighlightErrors] = useState(false);

    const [isLoading, setLoading] = useState(false);
    const { user, isLoading: authLoading } = useAuth();

    const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
    const { toast } = useToast();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            return;
        }

        if (e.key === "Escape") {
            setSelectedRows([]);
            setRowRange([1, 1]);

            toast({
                title: "Selection cleared",
                description: "All rows have been deselected",
            })
        }

        if (e.key === " " && !isTranslating && selectedColumns.length > 0 && selectedRows.length > 0) {
            e.preventDefault();
            translateCSV();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "s" && (csvData.length || translatedData.length)) {
            e.preventDefault();
            downloadCSV();
        }
    }

    const handleFileUpload = (uploadedData: string[][], uploadedHeaders: string[]) => {
        setCsvData(uploadedData);
        setHeaders(uploadedHeaders);
        setSelectedColumns([]);
        setSelectedRows([]);
        setRowRange([1, uploadedData.length])
        setTranslated(false);
        setTranslationErrors([]);

        toast({
            title: "CSV File uploaded successfully!",
            description: `${uploadedData.length} rows and ${uploadedHeaders.length} columns detected`,
        })
    }

    const handleColumnToggle = (column: string, isShiftKey = false, isCtrlKey = false) => {
        if (isShiftKey && selectedColumns.length > 0) {
          const lastSelected = selectedColumns[selectedColumns.length - 1]

          const lastSelectedIndex = headers.indexOf(lastSelected)
          const currentIndex = headers.indexOf(column)

          if (lastSelectedIndex !== -1 && currentIndex !== -1) {
            const start = Math.min(lastSelectedIndex, currentIndex)
            const end = Math.max(lastSelectedIndex, currentIndex)

            const columnsInRange = headers.slice(start, end + 1)

            const existingOutsideRange = selectedColumns.filter((col) => {
              const colIndex = headers.indexOf(col)
              return colIndex < start || colIndex > end
            })

            setSelectedColumns([...existingOutsideRange, ...columnsInRange])
          }
        } else if (isCtrlKey) {
          setSelectedColumns((prev) => (prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]))
        } else {
          setSelectedColumns((prev) => (prev.includes(column) ? prev.filter((col) => col !== column) : [column]))
        }
    }

    const handleLanguageChange = (type: LanguageType, language: string) => {
        type === "source" ? setSourceLanguage(language) : setTargetLanguage(language);
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

    const handleRowSelect = (rowIdx: number, isShiftKey: boolean, isCtrlKey: boolean) => {
        if (isShiftKey && selectedRows.length > 0) {
            const lastSelectedRow = selectedRows[selectedRows.length - 1];

            const start = Math.min(lastSelectedRow, rowIdx);
            const end = Math.max(lastSelectedRow, rowIdx);

            const rangeRows = Array.from({ length: end - start + 1 }, (_, i) => start + i)
            setSelectedRows(rangeRows);
            setRowRange([start + 1, end + 1]);
        } else if (isCtrlKey) {
            setSelectedRows((prev) => (prev.includes(rowIdx) ? prev.filter((r) => r !== rowIdx) : [...prev, rowIdx]))
        } else {
            setSelectedRows([rowIdx]);
            setRowRange([rowIdx + 1, rowIdx + 1]);
        }
    }

    const clearDashboard = () => {
        setCsvData([]);
        setHeaders([]);
        setSelectedColumns([]);
        setSelectedRows([]);
        setRowRange([1, 1]);
        setTranslatedData([]);
        setTranslated(false);
        setShowUploadConfirmation(false);
        setTranslationErrors([]);

        toast({
            title: "Dashboard cleared",
            description: "You can now upload a new CSV file",
        })
    }

    const handleSelectAllColumns = () => {
        setSelectedColumns([...headers])
    }

    const handleDeselectAllColumns = () => {
        setSelectedColumns([])
    }

    const translateCSV = async () => {
        if (selectedColumns.length === 0) {
            toast({
              title: "No columns selected",
              description: "Please select at least one column to translate",
              variant: "destructive",
            })
            return
        }

        if (selectedRows.length === 0) {
            toast({
                title: "No rows selected",
                description: "Please select at least one row to translate",
                variant: "destructive",
            })
            return
        }

        if (sourceLanguage === targetLanguage) {
            toast({
                title: "Same languages selected",
                description: "Source and target languages must be different",
                variant: "destructive",
            })
            return
        }

        setTranslating(true);
        setTranslationErrors([]);

        try {
            const baseData = translatedData.length > 0 ? translatedData : csvData;
            const newData = baseData.map(row => [...row]);
            const newErrors: { row: number; col: number }[] = []

            await new Promise(resolve => setTimeout(resolve, 1500));

            selectedRows.forEach(rowIndex => {
                selectedColumns.forEach(column => {
                    const colIndex = headers.indexOf(column);
                    if (colIndex >= 0 && rowIndex < newData.length) {
                        const currentValue = newData[rowIndex][colIndex];
                        const hasError = Math.random() < 0.2; // 20% chance of error

                        let newValue;
                        if (currentValue.includes("[TRANSLATED TO")) {
                            newValue = currentValue;
                        } else {
                            newValue = hasError
                                ? `${csvData[rowIndex][colIndex]} (${sourceLanguage} → ${targetLanguage}?)`
                                : `${csvData[rowIndex][colIndex]} (${sourceLanguage} → ${targetLanguage})`;
                        }

                        newData[rowIndex][colIndex] = newValue;

                        if (hasError) {
                            newErrors.push({ row: rowIndex, col: colIndex });
                        }
                    }
                });
            });

            setTranslatedData(newData);
            setTranslationErrors(newErrors);
            setTranslated(true);

            toast({
                title: "Translation completed",
                description: `Translated ${selectedColumns.length} columns in ${selectedRows.length} rows ` +
                           `from ${getLanguageName(sourceLanguage)} to ${getLanguageName(targetLanguage)}`,
            });
        } catch (error) {
            console.error("Translation error:", error);
            toast({
                title: "Translation failed",
                description: error instanceof Error ? error.message : "There was an error during translation",
                variant: "destructive",
            });
        } finally {
            setTranslating(false);
        }
    }

    const downloadCSV = () => {
        /* download */
        if (!translatedData.length && !csvData.length) {
            toast({
              title: "No data to download",
              description: "There is no data available to download",
              variant: "destructive",
            })
            return
          }

        // BACKEND: Generate downloadable CSV file
        // API Call: POST /api/csv/export
        // Request body: { data: translatedData.length ? translatedData : csvData, headers }
        // Response: Blob or download URL

        const dataToDownload = translatedData.length ? translatedData : csvData
        const csvContent = [headers.join(","), ...dataToDownload.map((row) => row.join(","))].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "translated_data.csv")
        document.body.appendChild(link)
        link.click()

        setTimeout(() => {
            URL.revokeObjectURL(url)
            document.body.removeChild(link)
        }, 100)

        toast({
            title: "File downloaded",
            description: "Your CSV file has been downloaded successfully",
        })
    }

    const handleCellRevert = (rowIndex: number, colIndex: number) => {
        if (csvData.length > 0) {
            // BACKEND: Revert a cell to its original value
            // API Call: PUT /api/translations/revert-cell
            // Request body: { rowIndex, colIndex, translationId? }

            const newData = [...translatedData]
            newData[rowIndex][colIndex] = csvData[rowIndex][colIndex]
            setTranslatedData(newData)

            toast({
              title: "Cell reverted",
              description: "The cell has been reverted to its original value",
            })
        }
    }

    const handleHighlightErrors = () => {
        setHighlightErrors(true);
        setTimeout(() => setHighlightErrors(false), 1500)
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedRows, selectedColumns, isTranslating, translatedData, csvData])

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

        <main className="container mx-auto py-8 px-4 flex-1 relative">
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
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                            <TranslationOptions
                                headers={headers}
                                selectedColumns={selectedColumns}
                                sourceLanguage={sourceLanguage}
                                targetLanguage={targetLanguage}
                                onColumnToggle={handleColumnToggle}
                                onLanguageChange={handleLanguageChange}
                                onSelectAllColumns={handleSelectAllColumns}
                                onDeselectAllColumns={handleDeselectAllColumns}
                            />

                            <div className='space-y-4'>
                                <RowRangeSelector
                                    totalRows={csvData.length}
                                    selectedRowsNum={selectedRows.length}
                                    selectedRange={rowRange}
                                    onRangeChange={handleRowRangeChange}
                                />

                                <div className='flex justify-end'>
                                    <ShortcutsHelpDialog
                                        trigger={
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <HelpCircle className="h-4 w-4" />
                                                Usage Tips & Shortcuts
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <TranslationButtons
                            translateCSV={translateCSV}
                            downloadCSV={downloadCSV}
                            isTranslating={isTranslating}
                            isTranslated={isTranslated}
                            selectedColumnsCount={selectedColumns.length}
                            translationErrors={translationErrors}
                            onHighlightErrors={handleHighlightErrors}
                        />

                        <div className='border rounded-lg overflow-hidden'>
                            <CSVTable
                                key={translatedData.length}
                                headers={headers}
                                data={translatedData.length > 0 ? translatedData : csvData}
                                selectedColumns={selectedColumns}
                                selectedRows={selectedRows}
                                isEditable={isTranslated}
                                onCellEdit={handleCellEdit}
                                onRowSelect={handleRowSelect}
                                originalData={csvData}
                                sourceLanguage={sourceLanguage}
                                targetLanguage={targetLanguage}
                                translationErrors={translationErrors}
                                highlightErrors={hightlightErrors}
                                onCellRevert={handleCellRevert}
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
            onDownload={downloadCSV}
            onConfirm={clearDashboard}
        />
        </div>
    )
}

export default Dashboard