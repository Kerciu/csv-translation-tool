import { FileSpreadsheet, Upload } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

const CSVUploader = () => {
  return (
    <div>
        <input />

        <FileSpreadsheet/>

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