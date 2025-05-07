import React from 'react';

const CSVPreviewVisualisation = () => {
  return (
    <div className='mb-4 overflow-hidden rounded-md border'>
      <div className='grid grid-cols-[0.25fr,1fr,1fr,1fr] text-xs'>
        <div className='bg-muted p-2 font-medium'>#</div>
        <div className='bg-muted p-2 font-medium'>Name</div>
        <div className='bg-muted p-2 font-medium'>Description</div>
        <div className='bg-muted p-2 font-medium'>Category</div>

        <div className='border-t p-2'>1</div>
        <div className='border-t bg-primary/5 p-2'>Schmitterling</div>
        <div className='border-t p-2'>A bug that flies</div>
        <div className='border-t p-2'>Animal</div>

        <div className='border-t p-2'>2</div>
        <div className='border-t p-2'>Computer Science</div>
        <div className='border-t bg-primary/5 p-2'>Dziedzina nauki</div>
        <div className='border-t p-2'>Studies</div>
      </div>
    </div>
  );
};

export default CSVPreviewVisualisation;
