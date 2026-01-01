'use client';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export const Card = ({
    children,
    className = '',
    title,
    description,
    icon,
}: CardProps) => {
    return (
        <div className={`bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl rounded-[32px] p-10 shadow-2xl relative z-10 ${className}`}>
            {(title || icon) && (
                <div className="text-center mb-10">
                    {icon && (
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-blue-600/30 mx-auto mb-6">
                            {icon}
                        </div>
                    )}
                    {title && <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">{title}</h1>}
                    {description && <p className="text-slate-400 mt-2">{description}</p>}
                </div>
            )}
            {children}
        </div>
    );
};
