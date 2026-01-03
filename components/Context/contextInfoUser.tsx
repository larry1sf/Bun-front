"use client"
import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext<{
    user: User;
    setUser: (user: User) => void
}>({
    user: { username: null, email: null, id: null, securityPhrase: null, image: null },
    setUser: () => { }
})

interface User {
    username: string | null;
    email: string | null;
    id: number | null;
    securityPhrase: string | null;
    image: string | null;
}
export const UserProvider = ({ initialValue, children }: { initialValue: User; children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(initialValue)

    useEffect(() => {
        if (initialValue)
            setUser(initialValue)

    }, [initialValue])

    return (
        < UserContext.Provider value={{ user, setUser }} >
            {children}
        </UserContext.Provider >
    )
}

export const useUser = () => useContext(UserContext)
