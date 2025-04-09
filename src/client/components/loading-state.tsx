import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingState = ({ message }: { message: boolean }) => {
  return (
    <div className="py-8 flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

export default LoadingState