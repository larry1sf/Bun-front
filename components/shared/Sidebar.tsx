'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Ellipsis } from 'lucide-react';

interface SidebarItemProps {
    icon: string;
    label: string;
    active?: boolean;
    onClick?: () => void;
    className?: string;
    isOpen: boolean;
}

export const SidebarItem = ({ icon, label, active = false, onClick, className = "", isOpen }: SidebarItemProps) => (
    <div
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'} ${onClick ? 'cursor-pointer' : 'cursor-not-allowed'} ${className}`}
    >
        <span className="text-xl">{icon}</span>
        {isOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
    </div>
);

interface SidebarProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    onLogout: () => void;
    userName?: string;
    userPlan?: string;
    children?: React.ReactNode;
}

export const Sidebar = ({ isOpen, setOpen, onLogout, userName = "User", userPlan = "Plan", children }: SidebarProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUserInfoClick = () => {
        setIsDropdownOpen(false);
        // Aquí puedes agregar la lógica para mostrar información del usuario
        console.log('Mostrar información del usuario');
    };

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        onLogout();
    };

    return (
        <aside className={`${isOpen ? 'w-72' : 'w-20'} bg-slate-950/50 border-r border-slate-900 transition-all duration-500 flex flex-col p-4 z-20 h-screen`}>
            <Link href="/" className="flex items-center space-x-3 px-2 w-fit mb-6 h-10">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">A</div>
                {isOpen && <span className="text-xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">Antigravity IA</span>}
            </Link>

            {/* New Chat Button */}
            <button className={`flex items-center justify-center space-x-2 mb-6 p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all duration-200 group ${!isOpen && 'w-12 h-12 self-center'}`}>
                <span className="text-blue-400 group-hover:scale-110 transition-transform">➕</span>
                {isOpen && <span className="text-sm font-medium text-slate-300">Nuevo Chat</span>}
            </button>

            <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                {isOpen && (
                    <div className="px-2 mb-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recientes</p>
                    </div>
                )}
                {children}

                <div className="pt-4 mt-4 border-t border-slate-900/50">
                    {/* <SidebarItem
                        icon="e"
                        label="Nada aun"
                        className="hover:bg-red-500/10 hover:text-red-400 text-sm py-2"
                        isOpen={isOpen}
                    /> */}
                </div>
            </nav>

            <div className="mt-auto px-2 py-4 border-t border-slate-900 relative" ref={dropdownRef}>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse border border-slate-700"></div>
                    {isOpen && (
                        <>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold truncate">{userName}</p>
                                <p className="text-xs text-slate-500 truncate">{userPlan}</p>
                            </div>
                            <div>
                                <button
                                    className='p-2 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors'
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    aria-label="Opciones de usuario"
                                >
                                    <Ellipsis className="w-5 h-5 text-slate-400"></Ellipsis>
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Dropdown Menu */}
                {isOpen && isDropdownOpen && (
                    <div className="absolute bottom-full left-2 right-2 mb-2 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 [&>button]:cursor-pointer">
                        <button
                            onClick={handleUserInfoClick}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Información de Usuario</span>
                        </button>
                        <div className="border-t border-slate-800"></div>
                        <button
                            onClick={handleLogoutClick}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};
