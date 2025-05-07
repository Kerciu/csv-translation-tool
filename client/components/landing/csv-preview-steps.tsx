import { Download, Languages, Upload } from 'lucide-react';
import React from 'react';

const CSVPreviewSteps = () => {
  return (
    <div className='grid grid-cols-3 gap-2 text-center text-sm'>
      <div className='flex flex-col items-center'>
        <div className='mb-2 rounded-full bg-muted p-2'>
          <Upload className='size-4 text-primary' />
        </div>
        <span>Upload</span>
      </div>

      <div className='flex flex-col items-center'>
        <div className='mb-2 rounded-full bg-muted p-2'>
          <Languages className='size-4 text-primary' />
        </div>
        <span>Translate</span>
      </div>

      <div className='flex flex-col items-center'>
        <div className='mb-2 rounded-full bg-muted p-2'>
          <Download className='size-4 text-primary' />
        </div>
        <span>Download</span>
      </div>
    </div>
  );
};

export default CSVPreviewSteps;
