import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import AuthButton from './auth-button'

const LoginForm = () => {
  return (
    <>
        <div>
            <div>
                <Label>
                    Email
                </Label>
                <Input
                />
            </div>
            <div>
                <Label>
                    Password
                </Label>
                <Input
                />
            </div>

            <AuthButton message='Login with Email'/>
        </div>
    </>
  )
}

export default LoginForm