'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    variant?: 'success' | 'error' | 'info' | 'loading';
    duration?: number;
    onClose?: () => void;
}

export const Toast = ({ message, variant = 'info', duration = 3000, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (variant === 'loading') return;

        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose, variant]);

    if (!isVisible) return null;

    const variantStyles = {
        success: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
        error: 'bg-red-500/20 border-red-500/50 text-red-400',
        info: 'bg-zinc-900/80 border-slate-800 text-white',
        loading: 'bg-zinc-900/80 border-slate-800 text-white'
    };

    return (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-9999 px-8 py-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${variantStyles[variant]}`}>
            <div className="flex items-center space-x-3">
                {variant === 'loading' && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    );
};
