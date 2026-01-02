'use client';

export const SidebarSkeleton = () => {
    return (
        <div className="flex w-full">
            <aside className="w-72 bg-slate-950/50 border-r border-slate-900 flex flex-col p-4 z-20 h-screen">
                {/* Logo Skeleton */}
                <div className="flex items-center space-x-3 px-2 mb-6 h-10">
                    <div className="w-8 h-8 bg-slate-800 animate-pulse rounded-lg shadow-lg"></div>
                    <div className="h-6 w-32 bg-slate-800 animate-pulse rounded-md"></div>
                </div>

                {/* New Chat Button Skeleton */}
                <div className="flex items-center justify-center space-x-2 mb-6 p-3 rounded-xl border border-slate-900 bg-slate-900/50">
                    <div className="w-4 h-4 bg-slate-800 animate-pulse rounded-sm"></div>
                    <div className="h-4 w-24 bg-slate-800 animate-pulse rounded-md"></div>
                </div>

                <nav className="flex-1 space-y-4 overflow-y-auto">
                    <div className="px-2 mb-4">
                        <div className="h-2 w-16 bg-slate-800 animate-pulse rounded-md"></div>
                    </div>

                    {/* Skeleton Items */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-3 px-4 py-3 rounded-xl">
                            <div className="w-6 h-6 bg-slate-800 animate-pulse rounded-lg"></div>
                            <div className="h-4 w-3/4 bg-slate-800 animate-pulse rounded-md"></div>
                        </div>
                    ))}

                    <div className="pt-4 mt-4 border-t border-slate-900/50"></div>
                </nav>

                {/* User Info Skeleton */}
                <div className="mt-auto px-2 py-4 border-t border-slate-900 relative">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse border border-slate-700"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-24 bg-slate-800 animate-pulse rounded-md"></div>
                            <div className="h-3 w-16 bg-slate-800 animate-pulse rounded-md"></div>
                        </div>
                        <div className="w-8 h-8 bg-slate-800 animate-pulse rounded-lg"></div>
                    </div>
                </div>
            </aside>
            <div className="flex-1 flex flex-col relative bg-slate-950/20 h-screen">
                {/* Main Content Skeleton Placeholder */}
                <div className="p-8 space-y-6">
                    <div className="h-8 w-1/4 bg-slate-800 animate-pulse rounded-lg"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-slate-900/40 border border-slate-900 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                    <div className="h-64 bg-slate-900/40 border border-slate-900 rounded-2xl animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};
