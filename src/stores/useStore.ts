import { create } from 'zustand';

interface FXState {
    breath: boolean;
    bloom: boolean;
    stars: boolean;
    border: boolean;
    holo: boolean;
    dust: boolean;
    audio: boolean;
    setFx: (key: keyof Omit<FXState, 'setFx'>, value: boolean) => void;
    toggleFx: (key: keyof Omit<FXState, 'setFx'>) => void;
}

export const useStore = create<FXState>((set) => ({
    breath: true,
    bloom: true,
    stars: true,
    border: true,
    holo: false,
    dust: false,
    audio: false,
    setFx: (key, value) => set((state) => ({ ...state, [key]: value })),
    toggleFx: (key) => set((state) => ({ ...state, [key]: !state[key] })),
}));
