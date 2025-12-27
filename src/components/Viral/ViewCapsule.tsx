import { useState } from 'react';
import { useViralStore } from '../../lib/viralStore';
import { useAudioStore } from '../../lib/audio';
import { PLAYLIST } from '../../lib/playlist';
import Gift from 'lucide-react/dist/esm/icons/gift';
import Maximize2 from 'lucide-react/dist/esm/icons/maximize-2';
import clsx from 'clsx';

export const ViewCapsule = () => {
    const { mode, capsuleData, closeViral } = useViralStore();
    const { setTrack } = useAudioStore();
    const [isOpened, setIsOpened] = useState(false);

    // Removed auto-play useEffect to prevent potential infinite loops

    if (mode !== 'VIEW_CAPSULE_MODE' || !capsuleData) return null;

    const handleOpen = () => {
        setIsOpened(true);
        // Play music
        const trackIndex = PLAYLIST.findIndex(t => t.id === capsuleData.musicId);
        if (trackIndex !== -1) {
            setTrack(trackIndex);
        }

        // Add a small delay for animation then close overlay to show 3D scene
        setTimeout(() => {
            closeViral();
            // TODO: In real app, we would inject photos into the 3D scene here.
            // For now, closing viral reveals the default scene.
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500 pointer-events-auto">
            <div className="w-full max-w-sm text-center space-y-8 p-6">

                {/* Envelope / Capsule Icon Animation */}
                <div className={clsx(
                    "w-32 h-32 mx-auto bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/30 shadow-[0_0_50px_rgba(255,215,0,0.2)]",
                    isOpened ? "animate-ping opacity-0 duration-1000" : "animate-pulse"
                )}>
                    <Gift size={64} className="text-yellow-400" />
                </div>

                <div className={clsx("space-y-4 transition-all duration-500", isOpened ? "opacity-0 translate-y-10" : "opacity-100")}>
                    <h2 className="text-3xl font-serif text-yellow-400 font-bold tracking-wider">
                        您的专属记忆胶囊
                    </h2>

                    {capsuleData.message && (
                        <div className="bg-white/5 border border-white/10 p-6 rounded-lg relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-2 text-2xl">❝</div>
                            <p className="text-white/90 font-serif italic text-lg leading-relaxed">
                                {capsuleData.message}
                            </p>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black px-2 text-2xl">❞</div>
                        </div>
                    )}

                    <div className="pt-8">
                        <button
                            onClick={handleOpen}
                            className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold text-lg uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <Maximize2 size={20} />
                            打开记忆
                        </button>
                    </div>

                    <div className="text-xs text-white/30 uppercase tracking-[0.2em] pt-4">
                        Powered by 3D Memory Engine
                    </div>
                </div>

            </div>
        </div>
    );
};
