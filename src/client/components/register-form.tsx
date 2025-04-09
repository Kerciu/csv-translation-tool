import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import AuthButton from './auth-button'

const RegisterForm = () => {
  return (
    <>
        <div>
            <div>
                <Label>
                    Username
                </Label>
                <Input
                />
            </div>
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

            <AuthButton message='Register with Email'/>
        </div>
    </>
  )
}

export default RegisterForm