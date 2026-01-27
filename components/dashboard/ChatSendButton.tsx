import { Square } from "lucide-react";

interface ChatSendButtonProps {
    onClick: () => void;
    isLoading: boolean;
    isDisabled: boolean;
}

export function ChatSendButton({ onClick, isLoading, isDisabled }: ChatSendButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`
                cursor-pointer p-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg 
                ${isLoading
                    ? 'bg-red-500/20 text-red-500 border border-red-500/30 shadow-red-500/10 hover:bg-red-500/30'
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30'
                }
                disabled:opacity-40 disabled:scale-100 disabled:bg-blue-600 disabled:cursor-not-allowed disabled:border-transparent
            `}
        >
            {isLoading ? (
                <Square size={18} fill="currentColor" className="animate-pulse" />
            ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5.5 h-5.5 -rotate-45">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
            )}
        </button>
    );
}
