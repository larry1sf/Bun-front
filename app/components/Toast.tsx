'use client';

import { useEffect, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info' | 'loading';

interface ToastProps {
    message: string;
    variant?: ToastVariant;
    onClose?: () => void;
    duration?: number;
}

const icons = {
    success: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    error: (
        <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    info: (
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    loading: (
        <svg className="w-5 h-5 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    ),
};

const bgColors = {
    success: 'bg-emerald-500/10 border-emerald-500/20',
    error: 'bg-rose-500/10 border-rose-500/20',
    info: 'bg-blue-500/10 border-blue-500/20',
    loading: 'bg-slate-500/10 border-slate-500/20',
};

export function Toast({ message, variant = 'info', onClose, duration = 3000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        if (variant !== 'loading') {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose || (() => { }), 300); // Wait for fade-out animation
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose, variant]);

    if (!message) return null;

    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
            <div className={`flex items-center space-x-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${bgColors[variant]}`}>
                <div className="flex-shrink-0">
                    {icons[variant]}
                </div>
                <p className="text-sm font-medium text-slate-200">
                    {message}
                </p>
                {variant !== 'loading' && (
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose || (() => { }), 300);
                        }}
                        className="ml-4 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
