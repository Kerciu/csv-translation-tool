import { Download, Languages, Upload } from 'lucide-react'
import React from 'react'

const CSVPreviewSteps = () => {
  return (
    <div>
        <div>
          <div>
            <Upload className='h-4 w-4 text-primary'/>
          </div>
          <span>Upload</span>
        </div>

        <div>
          <div>
            <Languages className='h-4 w-4 text-primary'/>
          </div>
          <span>Translate</span>
        </div>

        <div>
          <div>
            <Download className='h-4 w-4 text-primary'/>
          </div>
          <span>Download</span>
        </div>
    </div>
  )
}

export default CSVPreviewSteps