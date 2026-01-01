'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HOST_SERVER } from "../const";
import { Sidebar, SidebarItem } from '@/components/shared/Sidebar';
import { Background } from '@/components/ui/Background';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Dashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${HOST_SERVER}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="flex min-h-screen font-['Inter',sans-serif] text-slate-200 selection:bg-blue-500/30">
            <Background />

            <Sidebar
                isOpen={isSidebarOpen}
                setOpen={setSidebarOpen}
                onLogout={handleLogout}
                userName="Larry Dev"
                userPlan="Plan Premium"
            >
                <SidebarItem icon="📊" label="Panel de Control" active isOpen={isSidebarOpen} />
                {/* <SidebarItem icon="📈" label="Analíticas" isOpen={isSidebarOpen} />
                <SidebarItem icon="💰" label="Transacciones" isOpen={isSidebarOpen} />
                <SidebarItem icon="👥" label="Clientes" isOpen={isSidebarOpen} />
                <SidebarItem icon="⚙️" label="Configuración" isOpen={isSidebarOpen} /> */}
            </Sidebar>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Top Header */}
                <header className="h-20 flex items-center justify-between px-8 border-b border-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                    <h1 className="text-2xl font-bold tracking-tight">Vista General del Sistema</h1>
                    <div className="flex items-center space-x-6">
                        <Button
                            className="bg-blue-600 hover:bg-blue-500 text-sm font-semibold py-2 px-5"
                            icon="+"
                        >
                            Nuevo Chat
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-3 gap-6 p-8">
                    <Input
                        className="col-span-2"
                        id="message-ia"
                    />
                    <Button
                        className="col-span-1 bg-blue-600 hover:bg-blue-500 text-sm font-semibold py-2 px-5"
                        icon="Enviar"
                    >
                    </Button>
                </div>
            </main>
        </div>
    );
}
