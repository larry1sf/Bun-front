'use client';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    icon: string;
    color: string;
}

export const StatCard = ({ title, value, change, icon, color }: StatCardProps) => (
    <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl p-6 rounded-3xl hover:border-slate-700/60 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-xl`}>
                {icon}
            </div>
            <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded-lg">
                {change}
            </span>
        </div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-100 group-hover:scale-[1.02] transition-transform duration-300">{value}</p>
    </div>
);
