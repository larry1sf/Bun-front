'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-['Inter',sans-serif]">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-md relative">
                {/* Card */}
                <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl rounded-[32px] p-10 shadow-2xl relative z-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-blue-600/30 mx-auto mb-6">
                            A
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">Bienvenido de nuevo</h1>
                        <p className="text-slate-400 mt-2">Ingresa tus credenciales para acceder a tu cuenta</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1 block">Correo Electrónico</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 group-hover:border-slate-700"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-medium text-slate-300">Contraseña</label>
                                <button type="button" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">¿Olvidaste tu contraseña?</button>
                            </div>
                            <div className="relative group">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 group-hover:border-slate-700"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <Link href="/dashboard" className="block w-full">
                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center space-x-2">
                                <span>Iniciar Sesión</span>
                                <span className="text-xl">→</span>
                            </button>
                        </Link>
                    </form>

                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-8">
                    ¿No tienes una cuenta? <button className="text-blue-400 font-semibold hover:underline">Crear cuenta</button>
                </p>
            </div>
        </div>
    );
}
