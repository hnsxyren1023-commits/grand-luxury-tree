import { useEffect, useRef } from 'react';
import { useAudioStore } from '../lib/audio';
import { PLAYLIST } from '../lib/playlist';
// import clsx from 'clsx'; // Unused

export const AudioManager = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const { isPlaying, currentTrackIndex, volume, isMuted, nextTrack } = useAudioStore();
    // const [isExpanded, setIsExpanded] = useState(false); // Unused


    const track = PLAYLIST[Math.abs(currentTrackIndex) % PLAYLIST.length];

    // Audio Logic
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.warn("Autoplay prevented:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, track]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Auto-play on mount (user interaction usually required, but we try)
    useEffect(() => {
        // togglePlay(); // Let's not auto-play immediately to be polite, or maybe we do? 
        // User requested "Viral" so maybe auto-play is expected, but browsers block it.
        // Let's leave it manual or triggered by first interaction elsewhere.
    }, []);

    return (
        <>
            <audio
                ref={audioRef}
                src={track.url}
                onEnded={nextTrack}
                loop={false}
                preload="auto"
            />

            {/* Music Widget UI Removed - using Global Interface Toggle */}
        </>
    );
};
