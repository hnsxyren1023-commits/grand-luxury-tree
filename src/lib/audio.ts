import { create } from 'zustand';

interface AudioState {
    isPlaying: boolean;
    currentTrackIndex: number;
    volume: number;
    isMuted: boolean;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setTrack: (index: number) => void;
    setVolume: (vol: number) => void;
    toggleMute: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
    isPlaying: false,
    currentTrackIndex: 0,
    volume: 0.5,
    isMuted: false,
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    nextTrack: () => set((state) => ({ currentTrackIndex: state.currentTrackIndex + 1 })), // Playlist logic typically handles wrapping in the component or here. Let's keep it simple here.
    prevTrack: () => set((state) => ({ currentTrackIndex: state.currentTrackIndex - 1 })),
    setTrack: (index) => set({ currentTrackIndex: index }),
    setVolume: (vol) => set({ volume: vol }),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));
