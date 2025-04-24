import React from 'react'

const CSVPreviewVisualisation = () => {
  return (
    <div className='border rounded-md overflow-hidden mb-4'>
        <div className='grid grid-cols-[0.25fr,1fr,1fr,1fr] text-xs'>
            <div className='font-medium p-2 bg-muted'>#</div>
            <div className='font-medium p-2 bg-muted'>Name</div>
            <div className='font-medium p-2 bg-muted'>Description</div>
            <div className='font-medium p-2 bg-muted'>Category</div>

            <div className='p-2 border-t'>1</div>
            <div className='p-2 border-t bg-primary/5'>Schmitterling</div>
            <div className='p-2 border-t'>A bug that flies</div>
            <div className='p-2 border-t'>Animal</div>

            <div className='p-2 border-t'>2</div>
            <div className='p-2 border-t'>Computer Science</div>
            <div className='p-2 border-t bg-primary/5'>Dziedzina nauki</div>
            <div className='p-2 border-t'>Studies</div>
        </div>
    </div>
  )
}

export default CSVPreviewVisualisation