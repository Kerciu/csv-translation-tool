import type React from "react"
import { createContext, useContext, useState } from "react"

interface AuthContextProps {
    user: any | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (username: string, email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    const login = async (email: string, password: string) => {}
    const register = async (username: string, email: string, password: string) => {}
    const logout = () => {}

    const value: AuthContextProps = {
        user,
        isLoading,
        login,
        register,
        logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("Error: useAuth must be used within AuthContext");
    return context;
}
