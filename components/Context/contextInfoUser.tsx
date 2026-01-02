"use client"
import { createContext, useContext, useState } from "react"

const UserContext = createContext<{ user: User; setUser: (user: User) => void }>({
    user: { username: null, email: null },
    setUser: () => { }
})

interface User {
    username: string | null;
    email: string | null;
}
export const UserProvider = ({ initialValue, children }: { initialValue: User; children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(initialValue)
    return (
        < UserContext.Provider value={{ user, setUser }} >
            {children}
        </UserContext.Provider >
    )
}

export const useUser = () => useContext(UserContext)
