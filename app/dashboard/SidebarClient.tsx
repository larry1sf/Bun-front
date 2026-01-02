'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { HOST_SERVER } from "../const"
import { Sidebar } from '@/components/shared/Sidebar'

interface SidebarClientProps {
    children: React.ReactNode
    user: { username: string, email: string } | null
}

export default function SidebarClient({ children, user }: SidebarClientProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const response = await fetch(`${HOST_SERVER}/logout`, {
                method: 'POST',
                credentials: 'include'
            })
            if (response.ok) {
                router.push('/login')
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
                userName={user?.username || ""}
                userPlan="Plan Premium"
            />
            <div className="flex-1 flex flex-col relative bg-slate-950/20 h-screen overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </>
    )
}
