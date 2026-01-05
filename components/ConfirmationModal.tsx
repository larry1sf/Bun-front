'use client';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar"
}: ConfirmationModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-xl font-semibold text-slate-200 mb-2">
                    {title}
                </h3>
                <div className="text-slate-400 text-base mb-6">
                    <Markdown remarkPlugins={[remarkGfm]}>
                        {message}
                    </Markdown>
                </div>

                <div className="flex items-center justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 cursor-pointer rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 cursor-pointer rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all text-sm font-medium"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
