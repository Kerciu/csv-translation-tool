import { Download, Languages, Upload } from 'lucide-react'
import React from 'react'

const CSVPreviewSteps = () => {
  return (
    <div className='grid grid-cols-3 gap-2 text-center text-sm'>
        <div className='flex flex-col items-center'>
          <div>
            <Upload className='h-4 w-4 text-primary'/>
          </div>
          <span>Upload</span>
        </div>

        <div className='flex flex-col items-center'>
          <div>
            <Languages className='h-4 w-4 text-primary'/>
          </div>
          <span>Translate</span>
        </div>

        <div className='flex flex-col items-center'>
          <div>
            <Download className='h-4 w-4 text-primary'/>
          </div>
          <span>Download</span>
        </div>
    </div>
  )
}

export default CSVPreviewSteps