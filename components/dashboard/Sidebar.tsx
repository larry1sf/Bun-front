'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Ellipsis, LogOut, User, MessageSquare, Plus, PanelLeftClose, Store, Download, Image, Copy, Trash2 } from 'lucide-react';
import { User as UserType } from '@/types';
import { useChat } from '@/components/context/contextInfoChat';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { GalleryModal } from '@/components/dashboard/GalleryModal';
import { useRouter } from 'next/navigation';
import { DropdownMenu } from '@/components/ui/DropdownMenu';

interface SidebarItemProps {
    id: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    className?: string;
    isOpen: boolean;
    onDelete?: () => void;
    onExportJson?: () => void;
    onCopyLastMessage?: () => void;
    onGallery?: () => void;
}

export const SidebarItem = ({
    icon,
    label,
    active = false,
    onClick,
    className = "",
    isOpen,
    onDelete,
    onExportJson,
    onCopyLastMessage,
    onGallery
}: SidebarItemProps) => {
    const router = useRouter()
    const handleLinkClick = () => {
        onClick?.()
        router.push(`/dashboard`)
    }

    return (
        <section
            onClick={handleLinkClick}
            className={`outline-transparent border  group flex items-center space-x-3 ${!isOpen ? "px-2 py-1.5 justify-center" : "px-4 py-3"} rounded-lg transition-all duration-200 relative ${active
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent'
                } ${onClick
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed'
                } ${className}`}
        >
            <span className="text-xl shrink-0">{icon}</span>
            {isOpen && <span className="font-medium whitespace-nowrap truncate text-sm flex-1">{label}</span>}
            {isOpen && (
                <DropdownMenu
                    animation="from-right"
                    textSize="text-xs"
                    trigger={
                        <button
                            className="opacity-0 cursor-pointer border border-white/10 group-hover:opacity-100 p-1.5 hover:bg-slate-700/50 text-slate-500 hover:text-slate-200 rounded-lg transition-all duration-300 backdrop-blur-sm"
                        >
                            <Ellipsis size={16} />
                        </button>
                    }
                    items={[
                        {
                            label: "Exportar como JSON",
                            icon: <Download size={18} />,
                            onClick: () => onExportJson?.()
                        },
                        {
                            label: "Galería",
                            icon: <Image size={18} />,
                            onClick: () => onGallery?.()
                        },
                        {
                            label: "Copiar último mensaje",
                            icon: <Copy size={18} />,
                            onClick: () => onCopyLastMessage?.()
                        },
                        {
                            label: "Eliminar",
                            icon: <Trash2 size={18} />,
                            variant: "danger",
                            onClick: () => onDelete?.()
                        }
                    ]}
                />
            )}
        </section>
    );
};

interface SidebarProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    onLogout: () => void;
    user: UserType | null;
    children?: React.ReactNode;
}

export const Sidebar = ({ isOpen, setOpen, onLogout, user, children }: SidebarProps) => {
    const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
    const [galleryConversationId, setGalleryConversationId] = useState<string | null>(null);
    const [galleryConversationTitle, setGalleryConversationTitle] = useState<string>("");

    const { conversations, currentConversationId, loadConversation, createNewChat, deleteConversation, isConversationsLoading } = useChat();

    // No longer needed at this level

    const handleUserInfoClick = () => {
        // Aquí puedes agregar la lógica para mostrar información del usuario
        console.log('Mostrar información del usuario');
    };

    const handleLogoutClick = () => {
        onLogout();
    };

    const goEccomerceManager = () => {
        // Navegación automática mediante Link
    };

    return (
        <aside className={`${isOpen ? 'w-72' : 'w-20'} bg-slate-950/50 border-r border-slate-900 transition-all duration-500 flex flex-col p-4 z-10 h-screen`}>
            <header className="flex items-center justify-between mb-6">
                <button
                    onClick={() => setOpen(!isOpen)}
                    className="flex items-center space-x-3 px-2 w-fit h-10">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">M</div>
                    {isOpen && <span className="text-xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">MoIA</span>}
                </button>
                {
                    isOpen && (
                        <button onClick={() => setOpen(!isOpen)}>
                            <PanelLeftClose className={`text-white `} size={24} />
                        </button>
                    )
                }
            </header>

            {/* Eccomerce actions */}
            <Link
                href="/dashboard/eccomerce-moncada"
                onClick={goEccomerceManager}
                className={`cursor-pointer flex items-center justify-center space-x-2 mb-4 p-3 rounded-lg transition-all duration-300 group shadow-lg bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-white border border-blue-400/20 *: ${!isOpen ? 'w-8 h-8 self-center px-0' : 'w-full'}`}
            >
                <Store size={24} className={`transition-transform duration-300 `} />
                {isOpen && <span className="text-sm font-bold text-white tracking-wide">Tienda Moncada</span>}
            </Link>
            {/* New Chat Button */}
            <button
                onClick={createNewChat}
                className={`cursor-pointer flex items-center justify-center space-x-2 mb-4 p-3 rounded-lg transition-all duration-300 group shadow-lg ${!isOpen ? 'w-8 h-8 self-center px-0' : 'w-full'} bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-white border border-blue-400/20`}
            >
                <Plus className={`transition-transform duration-300 ${isOpen ? 'group-hover:rotate-90' : ''}`} size={24} strokeWidth={2.5} />
                {isOpen && <span className="text-sm font-bold text-white tracking-wide">Nuevo Chat</span>}
            </button>

            <nav className={`flex-1 space-y-1 overflow-y-auto custom-scrollbar ${!isOpen ? 'w-8 h-8 self-center' : 'w-full'}`}>
                {isOpen && (
                    <div className="px-2 mb-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recientes</p>
                    </div>
                )}
                {children}

                <div className="space-y-1">
                    {isConversationsLoading ? (
                        // Conversation List Skeleton
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-3 px-4 py-3 rounded-xl animate-pulse">
                                <div className="w-5 h-5 bg-slate-800 rounded-lg shrink-0"></div>
                                {isOpen && <div className="h-4 bg-slate-800 rounded-md flex-1 w-full"></div>}
                            </div>
                        ))
                    ) : (
                        conversations.map(conv => (
                            <SidebarItem
                                key={conv.id}
                                id={conv.id}
                                icon={<MessageSquare size={18} />}
                                label={conv.title}
                                active={currentConversationId === conv.id}
                                onClick={() => loadConversation(conv.id)}
                                isOpen={isOpen}
                                onDelete={() => setConversationToDelete(conv.id)}
                                onExportJson={() => {
                                    fetch(`/api/dashboard/conversation?id=${conv.id}`, { credentials: "include" })
                                        .then(res => res.json())
                                        .then(data => {
                                            const blob = new Blob([JSON.stringify(data.messages, null, 2)], { type: 'application/json' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `chat-${conv.title || conv.id}.json`;
                                            a.click();
                                            URL.revokeObjectURL(url);
                                        })
                                        .catch(err => console.error("Export failed", err));
                                }}
                                onCopyLastMessage={() => {
                                    fetch(`/api/dashboard/conversation?id=${conv.id}`, { credentials: "include" })
                                        .then(res => res.json())
                                        .then(data => {
                                            const messages = data.messages || [];
                                            if (messages.length > 0) {
                                                const lastMsg = messages[messages.length - 1];
                                                const content = lastMsg.content
                                                    .filter((c: any) => c.type === 'text' || c.type === 'input_text')
                                                    .map((c: any) => c.text)
                                                    .join('\n');
                                                navigator.clipboard.writeText(content);
                                                // Optional: Show toast if available
                                            }
                                        })
                                        .catch(err => console.error("Copy failed", err));
                                }}
                                onGallery={() => {
                                    setGalleryConversationId(conv.id);
                                    setGalleryConversationTitle(conv.title);
                                }}
                            />
                        ))
                    )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-900/50">
                    {/* <SidebarItem
                        icon="e"
                        label="Nada aun"
                        className="hover:bg-red-500/10 hover:text-red-400 text-sm py-2"
                        isOpen={isOpen}
                    /> */}
                </div>
            </nav>

            <div className="mt-auto px-2 py-4 border-t border-slate-900 relative">
                <DropdownMenu
                    width="w-56"
                    position="top"
                    animation="from-bottom"
                    trigger={
                        <div className="flex items-center space-x-3 cursor-pointer">
                            <div className="size-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                                {user?.image ? (
                                    <img src={user.image} alt="User" className="size-full object-cover" />
                                ) : (
                                    <div className="size-full flex items-center justify-center text-slate-400">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            {isOpen && (
                                <>
                                    <div className="flex-1 space-y-0.5 overflow-hidden">
                                        <p className="text-sm font-semibold text-slate-300 truncate">{user?.username}</p>
                                        {user?.securityPhrase && (
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                                                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                                Verificado
                                            </div>
                                        )}
                                    </div>
                                    <Ellipsis className="w-5 h-5 text-slate-400 shrink-0" />
                                </>
                            )}
                        </div>
                    }
                    items={[
                        {
                            label: "Información de Usuario",
                            icon: <User size={20} />,
                            onClick: () => handleUserInfoClick()
                        },
                        {
                            label: "Cerrar Sesión",
                            icon: <LogOut size={20} />,
                            variant: "danger",
                            onClick: () => handleLogoutClick()
                        }
                    ]}
                />
            </div>

            <ConfirmationModal
                isOpen={!!conversationToDelete}
                onClose={() => setConversationToDelete(null)}
                onConfirm={() => {
                    if (conversationToDelete) {
                        deleteConversation(conversationToDelete);
                        setConversationToDelete(null);
                    }
                }}
                title="Eliminar conversación"
                message={`¿Estás seguro de que quieres eliminar esta conversación? **Esta acción no se puede deshacer.**`}
                confirmText="Eliminar"
                cancelText="Cancelar"
            />

            <GalleryModal
                isOpen={!!galleryConversationId}
                onClose={() => setGalleryConversationId(null)}
                conversationId={galleryConversationId}
                conversationTitle={galleryConversationTitle}
            />
        </aside>
    );
};
