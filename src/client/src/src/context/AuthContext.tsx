import type React from "react"

interface AuthContextProps {
    user: any | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (username: string, email: string, password: string) => Promise<void>
    logout: () => void
}
