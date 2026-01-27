'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { useUser } from '@/components/context/contextInfoUser'
import { ChatProvider } from '@/components/context/contextInfoChat'


export default function SidebarClient({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const { user, setUser } = useUser()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
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
            <div className={`flex-1 flex flex-col relative bg-slate-950/20 h-screen overflow-hidden ${isSidebarOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'} `}>
                {children}
            </div>
        </ChatProvider>
    )
}
