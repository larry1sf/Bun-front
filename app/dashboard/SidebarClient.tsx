'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { HOST_SERVER } from "../const"
import { Sidebar } from '@/components/shared/Sidebar'
import { useUser } from '@/components/Context/contextInfoUser'
import { User } from '@/types'

interface SidebarClientProps {
    children: React.ReactNode
    user: User | null
}

export default function SidebarClient({ children, user }: SidebarClientProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const router = useRouter()
    const { setUser } = useUser()
    const handleLogout = async () => {
        try {
            const response = await fetch(`${HOST_SERVER}/logout`, {
                method: 'POST',
                credentials: 'include'
            })
            if (response.ok) {
                router.push('/login')
                setTimeout(() => setUser({ username: '', email: '', id: -1, securityPhrase: '', image: null }), 300);
            }
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    return (
        <>
            <Sidebar
                isOpen={isSidebarOpen}
                setOpen={setSidebarOpen}
                onLogout={handleLogout}
                user={user}
            />
            <div className="flex-1 flex flex-col relative bg-slate-950/20 h-screen overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </>
    )
}
