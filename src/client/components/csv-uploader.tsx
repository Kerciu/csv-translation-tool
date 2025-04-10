'use client';

import { FileSpreadsheet, Upload } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from './ui/button'
import Papa from "papaparse";

interface CSVUploaderProps {
    onFileUpload: (data: string[][], headers: string[]) => void
}

const CSVUploader = ({ onFileUpload }: CSVUploaderProps) => {

    const [isDragging, setDragging] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
    }

    const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        
        const files = e.dataTransfer.files
        if (files && files.length > 0)
        {
            const file = files[0]
            if (file.type === 'text/csv' || file.name.endsWith('.csv'))
            {
                processFile(file);
            }
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0)
        {
            processFile(files[0]);
        }
    }

    const processFile = (file: File) => {
        /* ... file processing ... */
        setLoading(true);
        Papa.parse(file, {
            complete: (results) => {
                const parsedData = results.data as string[][];
                if (parsedData && parsedData.length > 0)
                {
                    const headers = parsedData[0];
                    const data = parsedData.slice(1).filter(
                        (row) => row.some((cell) => cell.trim() !== "")
                    );
                    
                    onFileUpload(data, headers);
                }

                setLoading(false);
            },
            error: () => {
                setLoading(false);
            }
        })
    }

    return (
        <div className={`border-2 border-dashed rounded-lg p-10 text-center 
            ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`
            }>
            <input
                type='file'
                accept='.csv'
                className='hidden'
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDragDrop}
                onChange={handleFileChange}
            />

            <FileSpreadsheet className='mx-auto h-12 w-12 text-muted-foreground mb-4'/>

            <h3 className='text-lg font-medium mb-2'>Upload your CSV File</h3>
            <p className='text-muted-foreground mb-6'>Drag and drop your file here, or click the button below</p>

            <Button className='gap-2'>
                <Upload className='h-4 w-4'/>
                Select your CSV File
            </Button>
        </div>
    )
}

export default CSVUploader