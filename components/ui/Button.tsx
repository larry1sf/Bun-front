'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const Button = ({
    children,
    variant = 'primary',
    isLoading,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = 'px-6 py-4 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20',
        secondary: 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 border border-slate-700',
        ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200',
        danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                    <span>{children}</span>
                    {icon && <span className="text-xl">{icon}</span>}
                </>
            )}
        </button>
    );
};
