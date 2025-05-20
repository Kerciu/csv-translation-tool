'use client';

import { FileSpreadsheet, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import Papa from 'papaparse';

interface CSVUploaderProps {
  onFileUpload: (data: string[][], headers: string[], file: File) => void;
  onError?: (error: unknown) => void;
}

const CSVUploader = ({ onFileUpload }: CSVUploaderProps) => {
  const [isDragging, setDragging] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        processFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    /* ... file processing ... */
    setLoading(true);
    Papa.parse(file, {
      complete: (results: Papa.ParseResult<unknown>) => {
        const parsedData = results.data as string[][];
        if (parsedData && parsedData.length > 0) {
          const headers = parsedData[0];
          const data = parsedData.slice(1).filter((row) => row.some((cell) => cell.trim() !== ''));

          onFileUpload(data, headers, file);
        }

        setLoading(false);
      },
      error: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div
      className={`rounded-lg border-2 border-dashed p-10 text-center
            ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragDrop}
    >
      <input
        type='file'
        accept='.csv'
        className='hidden'
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <FileSpreadsheet className='mx-auto mb-4 size-12 text-muted-foreground' />

      <h3 className='mb-2 text-lg font-medium'>Upload your CSV File</h3>
      <p className='mb-6 text-muted-foreground'>
        Drag and drop your file here, or click the button below
      </p>

      <Button className='gap-2' disabled={isLoading} onClick={() => fileInputRef.current?.click()}>
        <Upload className='size-4' />
        Select your CSV File
      </Button>
    </div>
  );
};

export default CSVUploader;
