'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HOST_SERVER } from "../const";
import { Sidebar, SidebarItem } from '@/components/shared/Sidebar';


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
        <>

            <Sidebar
                isOpen={isSidebarOpen}
                setOpen={setSidebarOpen}
                onLogout={handleLogout}
                userName="Larry Dev"
                userPlan="Plan Premium"
            >
            </Sidebar>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative bg-slate-950/20 h-screen overflow-y-auto custom-scrollbar">
                {/* Chat Area */}
                <div className="flex-1 pt-10 pb-32 px-4">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {/* Welcome State */}
                        <div className="text-center py-20 px-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-2xl shadow-blue-500/40 mx-auto mb-6 animate-bounce">
                                A
                            </div>
                            <h2 className="text-4xl font-bold mb-4 bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent">
                                ¿En qué puedo ayudarte hoy?
                            </h2>
                            <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
                                Soy Antigravity IA, tu asistente inteligente. Puedo ayudarte con análisis, código, redacción y más.
                            </p>

                            <div className="grid grid-cols-2 gap-3 mt-12 max-w-xl mx-auto">
                                {[
                                    { icon: "📈", text: "Analiza mi mercado" },
                                    { icon: "💻", text: "Escribe un script" },
                                    { icon: "📧", text: "Redacta un correo" },
                                    { icon: "🎨", text: "Ideas de diseño" }
                                ].map((item, i) => (
                                    <button key={i} className="flex flex-col items-start p-4 rounded-2xl border border-slate-800/50 bg-slate-900/30 hover:bg-slate-800 transition-all text-left group">
                                        <span className="text-xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                                        <span className="text-sm font-medium text-slate-300">{item.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mockup Chat Bubbles */}
                        <div className="flex flex-col space-y-6">
                            {/* AI Message */}
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-lg">A</div>
                                <div className="bg-slate-900/80 border border-slate-800/50 px-5 py-4 rounded-2xl rounded-tl-none max-w-[85%] text-slate-300 leading-relaxed shadow-sm">
                                    ¡Hola! Soy tu asistente de IA. Estoy listo para ayudarte con cualquier consulta que tengas. ¿Por dónde empezamos?
                                </div>
                            </div>

                            {/* User Message */}
                            <div className="flex items-start flex-row-reverse space-x-4 space-x-reverse">
                                <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-700">LD</div>
                                <div className="bg-blue-600 px-5 py-4 rounded-2xl rounded-tr-none max-w-[85%] text-white leading-relaxed shadow-lg shadow-blue-500/10">
                                    Me gustaría optimizar mi flujo de trabajo con Bun y React. ¿Tienes alguna sugerencia de arquitectura?
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Input Area */}
                <div className="sticky bottom-0 left-0 right-0 p-6 bg-linear-to-t from-slate-950 via-slate-950/90 to-transparent pt-20">
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-linear-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition-opacity"></div>
                        <div className="relative flex items-center bg-slate-900/80 border border-slate-800/50 backdrop-blur-xl rounded-2xl px-4 py-2 focus-within:border-blue-500/50 transition-all shadow-2xl">
                            <button className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
                                <span className="text-xl">📎</span>
                            </button>
                            <textarea
                                placeholder="Escribe un mensaje..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 placeholder-slate-500 py-3 px-4 resize-none h-[52px] max-h-40 custom-scrollbar"
                            />
                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
                                    <span className="text-xl">🎙️</span>
                                </button>
                                <button className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 -rotate-45">
                                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-600 text-center mt-3 font-medium">
                            Antigravity IA puede cometer errores. Considera verificar la información importante.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
