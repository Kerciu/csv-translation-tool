import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import AuthButton from './auth-button';

interface LoginFormProps {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
}

const LoginForm = ({ email, password, setEmail, setPassword }: LoginFormProps) => {
  return (
    <>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='Enter your email..'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            placeholder='Enter your password..'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <AuthButton message='Login with Email' />
      </div>
    </>
  );
};

export default LoginForm;
