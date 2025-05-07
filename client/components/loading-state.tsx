import { Loader2 } from 'lucide-react';
import React from 'react';

const LoadingState = ({ message }: { message: string }) => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-8'>
      <Loader2 className='size-8 animate-spin text-primary' />
      <p className='text-muted-foreground'>{message}</p>
    </div>
  );
};

export default LoadingState;
