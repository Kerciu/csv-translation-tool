import React from 'react';
import CSVPreviewVisualisation from './csv-preview-visualisation';
import CSVPreviewSteps from './csv-preview-steps';
import { FileSpreadsheet } from 'lucide-react';

const CSVPreview = () => {
  return (
    <div className='relative rounded-xl border bg-card p-6 shadow-md'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='rounded-md bg-primary/10 p-2'>
            <FileSpreadsheet className='size-5 text-primary' />
          </div>
          <h3 className='font-medium'>CSV Translator</h3>
        </div>
        <div className='flex gap-1'>
          <div className='size-3 rounded-full bg-red-500'></div>
          <div className='size-3 rounded-full bg-yellow-500'></div>
          <div className='size-3 rounded-full bg-green-500'></div>
        </div>
      </div>

      <CSVPreviewVisualisation />

      <CSVPreviewSteps />
    </div>
  );
};

export default CSVPreview;
