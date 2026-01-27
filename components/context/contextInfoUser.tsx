"use client"
import { User } from "@/types";
import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext<{
    user: User;
    setUser: (user: User) => void
}>({
    user: { username: null, email: null, id: null, securityPhrase: null, image: null },
    setUser: () => { }
})

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
