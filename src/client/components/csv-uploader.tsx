'use client';

import { FileSpreadsheet, Upload } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from './ui/button'

interface CSVUploaderProps {
    onFileUpload: (data: string[][], headers: string[]) => void
}

const CSVUploader = ({ onFileUpload }: CSVUploaderProps) => {

    const [isDragging, setDragging] = useState<boolean>(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
        /* ... */
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        /* ... */
    }

    const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        /* ... */
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