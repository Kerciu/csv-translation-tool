import React from 'react';
import { Button } from './ui/button';
import { Mail } from 'lucide-react';

const AuthButton = ({ message }: { message: string }) => {
  return (
    <Button type='submit' className='w-full gap-2'>
      <Mail className='size-4' />
      {message}
    </Button>
  );
};

export default AuthButton;
