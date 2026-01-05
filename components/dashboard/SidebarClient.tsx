'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { HOST_SERVER } from "../../app/const"
import { Sidebar } from '@/components/dashboard/Sidebar'
import { useUser } from '@/components/Context/contextInfoUser'
import { ChatProvider } from '@/components/Context/contextInfoChat'


export default function SidebarClient({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const router = useRouter()
    const { user, setUser } = useUser()

    const handleLogout = async () => {
        try {
            const response = await fetch(`${HOST_SERVER}/logout`, {
                method: 'POST',
                credentials: 'include'
            })
            if (response.ok) {
                router.push('/login')
                setTimeout(() => setUser({ username: null, email: null, id: null, securityPhrase: null, image: null }), 300);
            }
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    return (
        <ChatProvider initialValue={null}>
            <Sidebar
                isOpen={isSidebarOpen}
                setOpen={setSidebarOpen}
                onLogout={handleLogout}
                user={user}
            />
            <div className="flex-1 flex flex-col relative bg-slate-950/20 h-screen overflow-hidden">
                {children}
            </div>
        </ChatProvider>
    )
}
