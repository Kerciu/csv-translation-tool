import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import AuthButton from './auth-button'

interface LoginFormProps {
    username: string
    email: string
    password: string
    setUsername: (value: string) => void
    setEmail: (value: string) => void
    setPassword: (value: string) => void
}

const RegisterForm = ({username, email, password, setUsername, setEmail, setPassword}: LoginFormProps) => {
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <AuthButton message='Register with Email'/>
        </div>
    </>
  )
}

export default RegisterForm