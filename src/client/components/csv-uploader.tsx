import { FileSpreadsheet, Upload } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

const CSVUploader = () => {
  return (
    <div className='border-2 border-dashed rounded-lg p-10 text-center'>
        <input
            type='file'
            accept='.csv'
            className='hidden'
        />

        <FileSpreadsheet className='mx-auto h-12 w-12 text-muted-foreground mb-4'/>

        <h3>Upload your CSV File</h3>
        <p>Drag and drop your file here, or click the button below</p>

        <Button>
            <Upload />
            Select your CSV File
        </Button>
    </div>
  )
}

export default CSVUploader