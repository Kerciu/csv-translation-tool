import type React from "react"
import { createContext, useContext } from "react"

interface AuthContextProps {
    user: any | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (username: string, email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("Error: useAuth must be used within AuthContext");
    return context;
}
