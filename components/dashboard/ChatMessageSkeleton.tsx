export default function ChatMessageSkeleton() {
    return (
        <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-6">
                    {/* Assistant Message Skeleton (Left) */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 shrink-0"></div>
                        <div className="space-y-2 flex-1 max-w-[80%]">
                            <div className="h-4 bg-slate-800 rounded-md w-1/4 animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-slate-800/50 rounded-md w-[90%] animate-pulse"></div>
                                <div className="h-3 bg-slate-800/50 rounded-md w-[75%] animate-pulse"></div>
                                <div className="h-3 bg-slate-800/50 rounded-md w-[85%] animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* User Message Skeleton (Right) */}
                    <div className="flex gap-4 justify-end">
                        <div className="space-y-2 flex-1 max-w-[80%] flex flex-col items-end">
                            <div className="h-10 bg-slate-800/80 rounded-2xl w-[60%] animate-pulse"></div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-slate-800 animate-pulse shrink-0"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
