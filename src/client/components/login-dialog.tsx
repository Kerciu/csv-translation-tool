import React from 'react'

interface LoginDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

const LoginDialog = ({isOpen, onOpenChange}) => {
  return (
    <div>LoginDialog</div>
  )
}

export default LoginDialog