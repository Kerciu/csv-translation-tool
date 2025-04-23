import React from 'react'
import CSVPreviewVisualisation from './csv-preview-visualisation'
import CSVPreviewSteps from './csv-preview-steps'
import { FileSpreadsheet } from 'lucide-react'

const CSVPreview = () => {
  return (
    <div className='relative bg-card rounded-xl shadow-md border p-6'>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-md">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">CSV Translator</h3>
        </div>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      <CSVPreviewVisualisation />

      <CSVPreviewSteps />

    </div>
  )
}

export default CSVPreview