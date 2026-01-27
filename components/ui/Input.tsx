'use client';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    rightElement?: React.ReactNode;
}

export const Input = ({
    label,
    error,
    helperText,
    rightElement,
    className = '',
    id,
    ...props
}: InputProps) => {
    return (
        <div className="space-y-2 w-full">
            {label && (
                <div className="flex justify-between items-center px-1">
                    <label htmlFor={id} className="text-xs md:text-sm font-medium text-slate-300 ml-1 block">
                        {label}
                    </label>
                    {rightElement}
                </div>
            )}
            <div className={`relative overflow-hidden group w-full bg-slate-950/50 border border-slate-800 rounded-2xl transition-all duration-300 hover:border-slate-700 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 ${error ? 'border-red-500/50' : ''}`}>
                <input
                    id={id}
                    className={`w-full h-full px-5 py-4 bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-600 ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
            {!error && helperText && <p className="text-xs text-slate-500 ml-1">{helperText}</p>}
        </div>
    );
};
