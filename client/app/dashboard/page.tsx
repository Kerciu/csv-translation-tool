'use client';

import CSVTable from '@/components/csv-table';
import CSVUploader from '@/components/csv-uploader';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import RowRangeSelector from '@/components/row-range-selector';
import ShortcutsHelpDialog from '@/components/shortcuts-help-dialog';
import TranslationButtons from '@/components/translation-buttons';
import TranslationOptions from '@/components/translation-options';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UploadConfirmationDialog from '@/components/upload-confirmation-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { LanguageType } from '@/lib/types';
import { getLanguageName } from '@/utils/getLanguageName';
import { FileSpreadsheet, HelpCircle, Loader2, Upload } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileId, setFileId] = useState<number>([]);
  const [title, setTitle] = useState<string>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [rowRange, setRowRange] = useState<[number, number]>([1, 1]);
  const [targetLanguage, setTargetLanguage] = useState('de');
  const [sourceLanguage, setSourceLanguage] = useState('en');

  const [isTranslating, setTranslating] = useState(false);
  const [isTranslated, setTranslated] = useState(false);
  const [translatedData, setTranslatedData] = useState<string[][]>([]);

  const [translationErrors, setTranslationErrors] = useState<{ row: number; col: number }[]>([]);
  const [hightlightErrors, setHighlightErrors] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (uploadedData: string[][], uploadedHeaders: string[], file:File) => {

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:8000/translation/upload_csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      const {status, title, id} = response.data;
      setFileId(id)
      setTitle(title)
      setCsvData(uploadedData);
      setHeaders(uploadedHeaders);
      setSelectedColumns([]);
      setSelectedRows([]);
      setRowRange([1, uploadedData.length]);
      setTranslated(false);
      setTranslationErrors([]);
      toast({
        title: `CSV File ${title} uploaded successfully!`,
        description: `${uploadedData.length} rows and ${uploadedHeaders.length} columns detected`,
      });
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || 'There was an error uploading the file',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleColumnToggle = (column: string, isShiftKey = false, isCtrlKey = false) => {
    if (isShiftKey && selectedColumns.length > 0) {
      const lastSelected = selectedColumns[selectedColumns.length - 1];

      const lastSelectedIndex = headers.indexOf(lastSelected);
      const currentIndex = headers.indexOf(column);

      if (lastSelectedIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastSelectedIndex, currentIndex);
        const end = Math.max(lastSelectedIndex, currentIndex);

        const columnsInRange = headers.slice(start, end + 1);

        const existingOutsideRange = selectedColumns.filter((col) => {
          const colIndex = headers.indexOf(col);
          return colIndex < start || colIndex > end;
        });

        setSelectedColumns([...existingOutsideRange, ...columnsInRange]);
      }
    } else if (isCtrlKey) {
      setSelectedColumns((prev) =>
        prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column],
      );
    } else {
      setSelectedColumns((prev) =>
        prev.includes(column) ? prev.filter((col) => col !== column) : [column],
      );
    }
  };

  const handleLanguageChange = (type: LanguageType, language: string) => {
    if (type === 'source') {
      setSourceLanguage(language);
    } else {
      setTargetLanguage(language);
    }
  };

  const handleCellEdit = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...translatedData];
    newData[rowIndex][colIndex] = value;
    setTranslatedData(newData);
  };

  const handleRowRangeChange = (range: [number, number]) => {
    setRowRange(range);

    const start = range[0] - 1;
    const end = range[1] - 1;

    const rangeRows = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    setSelectedRows(rangeRows);
  };

  const handleRowSelect = (rowIdx: number, isShiftKey: boolean, isCtrlKey: boolean) => {
    if (isShiftKey && selectedRows.length > 0) {
      const lastSelectedRow = selectedRows[selectedRows.length - 1];

      const start = Math.min(lastSelectedRow, rowIdx);
      const end = Math.max(lastSelectedRow, rowIdx);

      const rangeRows = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      setSelectedRows(rangeRows);
      setRowRange([start + 1, end + 1]);
    } else if (isCtrlKey) {
      setSelectedRows((prev) =>
        prev.includes(rowIdx) ? prev.filter((r) => r !== rowIdx) : [...prev, rowIdx],
      );
    } else {
      setSelectedRows([rowIdx]);
      setRowRange([rowIdx + 1, rowIdx + 1]);
    }
  };

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
      title: 'Dashboard cleared',
      description: 'You can now upload a new CSV file',
    });
  };

  const handleSelectAllColumns = () => {
    setSelectedColumns([...headers]);
  };

  const handleDeselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const translateCSV = async () => {
    if (selectedColumns.length === 0) {
      toast({
        title: 'No columns selected',
        description: 'Please select at least one column to translate',
        variant: 'destructive',
      });
      return;
    }

    if (selectedRows.length === 0) {
      toast({
        title: 'No rows selected',
        description: 'Please select at least one row to translate',
        variant: 'destructive',
      });
      return;
    }

    if (sourceLanguage === targetLanguage) {
      toast({
        title: 'Same languages selected',
        description: 'Source and target languages must be different',
        variant: 'destructive',
      });
      return;
    }

    setTranslating(true);
    setTranslationErrors([]);

    const baseData = translatedData.length > 0 ? translatedData : csvData;
    const newData = baseData.map((row) => [...row]);
    const newErrors: { row: number; col: number }[] = [];

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const columnIdxList = [];
    const rowIdxList = [];

    selectedRows.forEach((rowIndex) => {
      selectedColumns.forEach((column) => {
        const colIndex = headers.indexOf(column);
        if (colIndex >= 0 && rowIndex < newData.length) {
          columnIdxList.push(colIndex);
          rowIdxList.push(rowIndex);
        }
      });
    });

    axios.post(
      'http://localhost:8000/translation/translate_cells',
      {
        column_idx_list: columnIdxList,
        row_idx_list: rowIdxList,
        target_language: targetLanguage,
        source_language: sourceLanguage
      },
      { withCredentials: true }
    )
    .then((res) => {
      const translated = res.data.translated_list;

      for (let i = 0; i < columnIdxList.length; i++) {
        const row = rowIdxList[i];
        const col = columnIdxList[i];
        const t = translated[i][0];
        const d = translated[i][1];

        if (t !== "Cannot detect any language" && t !== "Cannot translate" && t !== "Error") {
          newData[row][col] = `${t} (${d} -> ${targetLanguage})`;
        } else {
          newData[row][col] = `${csvData[row][col]} (${t})`;
        }
      }

      setTranslatedData(newData);
      setTranslationErrors(newErrors);
      setTranslated(true);

      toast({
        title: 'Translation completed',
        description:
          `Translated ${selectedColumns.length} columns in ${selectedRows.length} rows ` +
          `from ${getLanguageName(sourceLanguage)} to ${getLanguageName(targetLanguage)}`,
      });
      setTranslating(false);
    })
    .catch((error) => {
      console.error("Translation error:", error);
      for (let i = 0; i < columnIdxList.length; i++) {
        const row = rowIdxList[i];
        const col = columnIdxList[i];
        const current = newData[row][col];
        // xx -> yy patern or "(cannot translate)"
        const cleaned = current.replace(/\((?:[a-z]{2}->[a-z]{2}|Cannot translate)\)\s*/gi, '');
        newData[row][col] = `${cleaned} (Cannot translate)`;
      }
    });



  };

  const downloadCSV = async () => {
    if (!translatedData.length && !csvData.length) {
      toast({
        title: 'No data to download',
        description: 'There is no data available to download',
        variant: 'destructive',
      });
      return;
    }

     try {
      const response = await axios.post(
        "http://localhost:8000/translation/dowloand_csv",
        { file_id: fileId },
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `translated_${title}.csv`);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);

      toast({
        title: "File downloaded",
        description: "Your CSV file has been downloaded successfully",
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "There was a problem downloading the CSV.",
        variant: "destructive",
      });
    }
  };

  const handleCellRevert = async (rowIndex: number, colIndex: number) => {
    if (csvData.length > 0) {
      const response = await axios.post( "http://localhost:8000/translation/revert_cell",{
          column_idx: colIndex,
          row_idx: rowIndex
        }, { withCredentials: true}
      );
      const newData = [...translatedData];
      newData[rowIndex][colIndex] = csvData[rowIndex][colIndex];
      setTranslatedData(newData);

      toast({
        title: 'Cell reverted',
        description: 'The cell has been reverted to its original value',
      });
    }
  };

  const handleHighlightErrors = () => {
    setHighlightErrors(true);
    setTimeout(() => setHighlightErrors(false), 1500);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        setSelectedRows([]);
        setRowRange([1, 1]);

        toast({
          title: 'Selection cleared',
          description: 'All rows have been deselected',
        });
      }

      if (
        e.key === ' ' &&
        !isTranslating &&
        selectedColumns.length > 0 &&
        selectedRows.length > 0
      ) {
        e.preventDefault();
        translateCSV();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's' && (csvData.length || translatedData.length)) {
        e.preventDefault();
        downloadCSV();
      }
    },
    [
      isTranslating,
      selectedColumns,
      selectedRows,
      csvData,
      translatedData,
      translateCSV,
      downloadCSV,
    ],
  );

  useEffect(() => {
    const fetchUserCSV = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/translation/get_user_csv', {
          withCredentials: true,
        });

        const fileData = response.data.file;

        const headers = fileData.columns.map((column: any) => column.name);
        const data = [];

        const rowCount = fileData.columns[0]?.cells.length || 0;

        for (let i = 0; i < rowCount; i++) {
          const row: string[] = [];
          fileData.columns.forEach((column: any) => {
            row.push(column.cells[i].text);
          });
          data.push(row);
        }

        setFileId(fileData.id);
        setTitle(fileData.title);
        setCsvData(data);
        setHeaders(headers);
        setRowRange([1, data.length]);

        toast({
          title: `CSV File ${fileData.title} loaded successfully!`,
          description: `${data.length} rows and ${headers.length} columns detected`,
        });
      } catch (error) {
        console.error('Error loading CSV file:', error);
        toast({
          title: 'Load failed',
          description: error.response?.data?.message || 'There was an error loading the file',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserCSV();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading || authLoading) {
    return (
      <div className='flex min-h-screen flex-col'>
        <Navbar />
        <main className='container mx-auto flex flex-1 items-center justify-center px-4 py-8'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='size-12 animate-spin text-primary' />
            <p className='text-lg text-muted-foreground'>Loading your dashboard...</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      <main className='container relative mx-auto flex-1 px-4 py-8'>
        <Card className='w-full'>
          <CardHeader className='text-center'>
            <CardTitle className='flex items-center justify-center gap-4 text-3xl'>
              <FileSpreadsheet className='size-8' />
              CSV Translation Tool
            </CardTitle>
            <CardDescription>
              Upload a CSV file, select columns to translate, and download the translated file
            </CardDescription>
          </CardHeader>
          <CardContent>
            {csvData.length > 0 ? (
              <div className='space-y-6'>
                <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
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
                          <Button variant='outline' size='sm' className='gap-2'>
                            <HelpCircle className='size-4' />
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

                <div className='overflow-hidden rounded-lg border'>
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
            ) : (
              <CSVUploader onFileUpload={handleFileUpload} />
            )}
          </CardContent>

          <CardFooter className='flex justify-center text-sm text-muted-foreground'>
            {csvData.length > 0 && (
              <Button
                variant='ghost'
                onClick={() => setShowUploadConfirmation(true)}
                className='gap-2'
              >
                <Upload className='size-4' />
                Upload a different file
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>

      <Footer />

      <UploadConfirmationDialog
        open={showUploadConfirmation}
        onOpenChange={setShowUploadConfirmation}
        onDownload={downloadCSV}
        onConfirm={clearDashboard}
      />
    </div>
  );
};

export default Dashboard;
