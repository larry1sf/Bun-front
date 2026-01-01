'use client';

import Link from 'next/link';

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
    return (
        <aside className={`${isOpen ? 'w-72' : 'w-20'} bg-slate-950/50 border-r border-slate-900 transition-all duration-500 flex flex-col p-4 z-20`}>
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

                <SidebarItem icon="💬" label="Análisis de Mercado" isOpen={isOpen} className="text-sm py-2" />
                <SidebarItem icon="📝" label="Draft de Proyecto" isOpen={isOpen} className="text-sm py-2" />
                <SidebarItem icon="💡" label="Ideas de Marketing" isOpen={isOpen} className="text-sm py-2" />

                {children}

                <div className="pt-4 mt-4 border-t border-slate-900/50">
                    <SidebarItem
                        icon="⚙️"
                        label="Configuración"
                        isOpen={isOpen}
                        className="text-sm py-2"
                        onClick={() => { }}
                    />
                    <SidebarItem
                        icon="🚪"
                        label="Cerrar Sesión"
                        onClick={onLogout}
                        className="hover:bg-red-500/10 hover:text-red-400 text-sm py-2"
                        isOpen={isOpen}
                    />
                </div>
            </nav>

            <div className="mt-auto px-2 py-4 border-t border-slate-900">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse border border-slate-700"></div>
                    {isOpen && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">{userName}</p>
                            <p className="text-xs text-slate-500 truncate">{userPlan}</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};
