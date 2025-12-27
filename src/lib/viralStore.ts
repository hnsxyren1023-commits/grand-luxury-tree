import { create } from 'zustand';

export type ViralMode = 'IDLE' | 'LANDING' | 'GREETING_MODE' | 'CAPSULE_MODE' | 'VIEW_CAPSULE_MODE';

interface ViralState {
    mode: ViralMode;
    isOpen: boolean;
    capsuleId: string | null;
    capsuleData: {
        photos: string[];
        message: string;
        musicId: string;
    } | null;
    setMode: (mode: ViralMode) => void;
    openViral: () => void;
    closeViral: () => void;
    setCapsuleId: (id: string | null) => void;
    setCapsuleData: (data: { photos: string[], message: string, musicId: string } | null) => void;
}

export const useViralStore = create<ViralState>((set) => ({
    mode: 'IDLE',
    isOpen: false,
    capsuleId: null,
    capsuleData: null,
    setMode: (mode) => set({ mode }),
    openViral: () => set({ isOpen: true }),
    closeViral: () => set({ isOpen: false }),
    setCapsuleId: (id) => set({ capsuleId: id }),
    setCapsuleData: (data) => set({ capsuleData: data }),
}));
