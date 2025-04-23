import React from 'react'
import CSVPreviewVisualisation from './csv-preview-visualisation'
import CSVPreviewSteps from './csv-preview'

const CSVPreview = () => {
  return (
    <div className='relative bg-card rounded-xl shadow-md border p-6'>
        <div>
            CSV Translator
        </div>

        <CSVPreviewVisualisation />

        <CSVPreviewSteps />
    </div>
  )
}

export default CSVPreview