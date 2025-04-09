import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import AuthButton from './auth-button'

const RegisterForm = () => {
  return (
    <>
        <div className='space-y-4'>
            <div className='space-y-2'>
                <Label>
                    Username
                </Label>
                <Input
                    id='name'
                    type='name'
                    placeholder='Enter your username..'
                />
            </div>
            <div className='space-y-2'>
                <Label>
                    Email
                </Label>
                <Input
                    id='email'
                    type='email'
                    placeholder='Enter your email..'
                />
            </div>
            <div className='space-y-2'>
                <Label>
                    Password
                </Label>
                <Input
                    id='password'
                    type='password'
                    placeholder='Enter your password..'
                    required
                />
            </div>

            <AuthButton message='Register with Email'/>
        </div>
    </>
  )
}

export default RegisterForm