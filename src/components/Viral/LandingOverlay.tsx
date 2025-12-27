import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useViralStore } from '../../lib/viralStore';
import Gift from 'lucide-react/dist/esm/icons/gift';
import Send from 'lucide-react/dist/esm/icons/send';

export const LandingOverlay = () => {
    const { mode, setMode, isOpen, closeViral } = useViralStore();
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen && mode === 'LANDING') {
            const timer = setTimeout(() => setAnimateIn(true), 100);
            return () => clearTimeout(timer);
        }
        setAnimateIn(false);
    }, [isOpen, mode]);

    if (!isOpen || mode !== 'LANDING') return null;

    return (
        <div className={clsx(
            "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-700 pointer-events-auto",
            animateIn ? "opacity-100" : "opacity-0"
        )}>
            <div className="flex flex-col items-center gap-8 max-w-md w-full p-6 text-center">
                {/* Title */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 font-serif tracking-widest drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                        圣诞记忆胶囊
                    </h1>
                    <p className="text-yellow-100/60 text-sm tracking-[0.2em] font-light">MEMORY CAPSULE 2026</p>
                </div>

                {/* Main Actions */}
                <div className="flex flex-col gap-4 w-full px-8">
                    {/* Option A: Send Greeting */}
                    <button
                        onClick={() => setMode('GREETING_MODE')}
                        className="group relative w-full py-4 bg-gradient-to-r from-red-900/40 to-red-800/40 border border-red-500/30 rounded-xl hover:border-red-400 hover:bg-red-800/50 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                        <div className="relative flex items-center justify-center gap-3">
                            <Send className="w-5 h-5 text-red-300 group-hover:text-white transition-colors" />
                            <span className="text-red-100 font-serif text-lg tracking-wider group-hover:text-white transition-colors">
                                发送祝福 (Mode A)
                            </span>
                        </div>
                    </button>

                    {/* Option B: Create Capsule */}
                    <button
                        onClick={() => setMode('CAPSULE_MODE')}
                        className="group relative w-full py-6 bg-gradient-to-r from-yellow-900/40 to-amber-800/40 border border-yellow-500/30 rounded-xl hover:border-yellow-400 hover:bg-yellow-800/50 transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                        <div className="relative flex flex-col items-center gap-2">
                            <div className="flex items-center gap-3">
                                <Gift className="w-6 h-6 text-yellow-300 group-hover:text-white transition-colors animate-bounce-slow" />
                                <span className="text-yellow-100 font-serif text-xl font-bold tracking-wider group-hover:text-white transition-colors">
                                    创建记忆胶囊 (Mode B)
                                </span>
                            </div>
                            <span className="text-yellow-200/50 text-xs tracking-widest uppercase">
                                Upload Photos & Seal Memories
                            </span>
                        </div>
                    </button>

                    <button
                        onClick={closeViral}
                        className="mt-4 text text-white/30 text-xs hover:text-white/80 transition-colors uppercase tracking-widest"
                    >
                        Just Browse The Tree
                    </button>
                </div>
            </div>
        </div>
    );
};
