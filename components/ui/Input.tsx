'use client';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    rightElement?: React.ReactNode;
}

export const Input = ({
    label,
    error,
    rightElement,
    className = '',
    id,
    ...props
}: InputProps) => {
    return (
        <div className="space-y-2 w-full">
            {label && (
                <div className="flex justify-between items-center px-1">
                    <label htmlFor={id} className="text-sm font-medium text-slate-300 ml-1 block">
                        {label}
                    </label>
                    {rightElement}
                </div>
            )}
            <div className="relative group">
                <input
                    id={id}
                    className={`w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 group-hover:border-slate-700 ${error ? 'border-red-500/50' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
        </div>
    );
};
