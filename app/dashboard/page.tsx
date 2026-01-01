'use client';

import Link from 'next/link';
import { useState } from 'react';

const SidebarItem = ({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) => (
    <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-not-allowed transition-all duration-200 ${active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
    </div>
);

const StatCard = ({ title, value, change, icon, color }: { title: string; value: string; change: string; icon: string; color: string }) => (
    <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl p-6 rounded-3xl hover:border-slate-700/60 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-xl`}>
                {icon}
            </div>
            <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded-lg">
                {change}
            </span>
        </div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-100 group-hover:scale-[1.02] transition-transform duration-300">{value}</p>
    </div>
);

export default function Dashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen bg-[#020617] font-['Inter',sans-serif] text-slate-200 selection:bg-blue-500/30">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-slate-950/50 border-r border-slate-900 transition-all duration-500 flex flex-col p-4 z-20`}>
                <Link href="/" className="flex items-center space-x-3 px-2 w-fit mb-10 h-10">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">A</div>
                    {isSidebarOpen && <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Antigravity</span>}
                </Link>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon="📊" label="Panel de Control" active />
                    <SidebarItem icon="📈" label="Analíticas" />
                    <SidebarItem icon="💰" label="Transacciones" />
                    <SidebarItem icon="👥" label="Clientes" />
                    <SidebarItem icon="⚙️" label="Configuración" />
                </nav>

                <div className="mt-auto px-2 py-4 border-t border-slate-900">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse border border-slate-700"></div>
                        {isSidebarOpen && (
                            <div>
                                <p className="text-sm font-semibold">Larry Dev</p>
                                <p className="text-xs text-slate-500">Plan Premium</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full"></div>

                {/* Top Header */}
                <header className="h-20 flex items-center justify-between px-8 border-b border-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                    <h1 className="text-2xl font-bold tracking-tight">Vista General del Sistema</h1>
                    <div className="flex items-center space-x-6">
                        <button className="bg-blue-600 cursor-pointer hover:bg-blue-500 text-sm font-semibold py-2 px-5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                            + Nuevo Informe
                        </button>
                    </div>
                </header>

            </main>
        </div>
    );
}
