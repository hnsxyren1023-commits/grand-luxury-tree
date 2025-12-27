import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import { useViralStore } from '../../lib/viralStore';
import { useAudioStore } from '../../lib/audio';
import { createCapsule, uploadPhoto } from '../../lib/supabase';
import { PLAYLIST } from '../../lib/playlist';
import { logEvent } from '../../lib/analytics';
import { PaymentPosterModal } from './PaymentPosterModal';

// Icons
import Upload from 'lucide-react/dist/esm/icons/upload';
import X from 'lucide-react/dist/esm/icons/x';
import Music from 'lucide-react/dist/esm/icons/music';
import Check from 'lucide-react/dist/esm/icons/check';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Plus from 'lucide-react/dist/esm/icons/plus';

const MAX_PHOTOS = 9;

export const CapsuleCreator = () => {
    const { mode, setMode, setCapsuleData } = useViralStore();
    const { currentTrackIndex, setTrack } = useAudioStore();

    // State
    const [photos, setPhotos] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMusicPickerOpen, setIsMusicPickerOpen] = useState(false);

    // UI State
    const [showPayment, setShowPayment] = useState(false);
    const [activeDeleteIdx, setActiveDeleteIdx] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter playlist to current track
    const currentTrack = PLAYLIST[Math.abs(currentTrackIndex) % PLAYLIST.length];

    // --- Actions ---

    const triggerUpload = () => {
        if (photos.length >= MAX_PHOTOS) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);

        // Calculate remaining slots
        const remaining = MAX_PHOTOS - photos.length;
        const toAdd = newFiles.slice(0, remaining);

        const newPreviews = toAdd.map(f => URL.createObjectURL(f));

        setPhotos(prev => [...prev, ...toAdd]);
        setPreviews(prev => [...prev, ...newPreviews]);

        // Reset input
        e.target.value = '';
    };

    const toggleDeleteMode = (idx: number) => {
        setActiveDeleteIdx(activeDeleteIdx === idx ? null : idx);
    };

    const confirmDelete = (idx: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotos(prev => prev.filter((_, i) => i !== idx));
        setPreviews(prev => {
            URL.revokeObjectURL(prev[idx]);
            return prev.filter((_, i) => i !== idx);
        });
        setActiveDeleteIdx(null);
    };

    const handleSubmit = () => {
        if (photos.length === 0) return;
        setShowPayment(true);
    };

    const executeSubmission = async () => {
        setShowPayment(false);
        setIsSubmitting(true);

        try {
            // 1. Upload
            const uploadPromises = photos.map(photo => uploadPhoto(photo));
            const photoUrls = await Promise.all(uploadPromises);

            // 2. Create Record (Always Premium for this flow)
            const capsule = await createCapsule(photoUrls, message, currentTrack.id, true);

            logEvent('create_capsule', { capsule_id: capsule.id, is_premium: true });

            // 3. Success
            setCapsuleData({
                photos: photoUrls,
                message: message,
                musicId: currentTrack.id
            });
            setMode('VIEW_CAPSULE_MODE');

        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to seal capsule. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (mode !== 'CAPSULE_MODE') return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300 pointer-events-auto p-4 md:p-8">
            <div className="w-full max-w-5xl h-[85vh] bg-zinc-900/80 border border-yellow-500/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">

                {/* Close Button (Absolute Top Right) */}
                <button
                    onClick={() => setMode('IDLE')}
                    className="absolute top-4 right-4 z-20 text-white/50 hover:text-white p-2 bg-black/20 rounded-full transition-colors"
                >
                    <X />
                </button>

                {/* --- Left Column: Photo Grid --- */}
                <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-black/20">
                    <div className="mb-6">
                        <h2 className="text-2xl font-serif text-yellow-400 font-bold tracking-wider">创建记忆胶囊</h2>
                        <p className="text-xs text-white/50 uppercase tracking-[0.2em] mt-1">Project 05 • 记忆提取</p>
                    </div>

                    {/* Section Header */}
                    <div className="mb-4 flex justify-between items-center text-sm text-yellow-100/70">
                        <span className="uppercase tracking-widest font-bold">1. 上传照片 ({photos.length}/{MAX_PHOTOS})</span>
                        {/* Optional: Add "Clear All" or other small controls here if needed */}
                    </div>

                    {/* Grid Container - Auto fit */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                            {/* Render 9 Slots */}
                            {Array.from({ length: MAX_PHOTOS }).map((_, i) => {
                                const hasPhoto = i < photos.length;
                                const preview = previews[i];
                                const isDeleting = activeDeleteIdx === i;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => hasPhoto ? toggleDeleteMode(i) : triggerUpload()}
                                        className={clsx(
                                            "aspect-square rounded-lg relative overflow-hidden transition-all duration-300 border cursor-pointer group",
                                            hasPhoto
                                                ? "border-yellow-500/30 hover:border-yellow-400"
                                                : "border-white/5 bg-white/5 hover:bg-white/10 border-dashed"
                                        )}
                                    >
                                        {/* Number Badge - Large Serif Style */}
                                        <div className={clsx(
                                            "absolute top-1 right-2 z-10 font-serif italic select-none pointer-events-none transition-colors",
                                            hasPhoto ? "text-white/50 text-xl" : "text-white/20 text-4xl group-hover:text-yellow-400/50"
                                        )}>
                                            {i + 1}
                                        </div>

                                        {hasPhoto ? (
                                            <>
                                                <img src={preview} className="w-full h-full object-cover" alt="" />

                                                {/* Delete Overlay */}
                                                <div className={clsx(
                                                    "absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 transition-opacity duration-200",
                                                    isDeleting ? "opacity-100" : "opacity-0"
                                                )}>
                                                    <span className="text-red-400 text-xs font-bold tracking-widest">移除?</span>
                                                    <button
                                                        onClick={(e) => confirmDelete(i, e)}
                                                        className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/50 rounded-full hover:bg-red-500 hover:text-white transition-colors text-xs"
                                                    >
                                                        删除
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Plus className="text-white/10 group-hover:text-yellow-400 transition-colors" size={24} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Inputs & Controls --- */}
                <div className="w-full md:w-[400px] flex flex-col bg-zinc-950/50">
                    <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto no-scrollbar">

                        {/* Message Input */}
                        <div className="space-y-3">
                            <span className="text-xs text-yellow-100/50 uppercase tracking-widest font-bold block">
                                2. 留下寄语
                            </span>
                            <div className="relative">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="写下这一刻的心情..."
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 focus:border-yellow-400/50 focus:outline-none transition-colors resize-none leading-relaxed"
                                    maxLength={200}
                                />
                                <div className="absolute bottom-3 right-3 text-[10px] text-white/30">
                                    {message.length}/200
                                </div>
                            </div>
                        </div>

                        {/* Music Selector - Compact */}
                        <div className="space-y-3">
                            <span className="text-xs text-yellow-100/50 uppercase tracking-widest font-bold block">
                                3. 背景音乐
                            </span>
                            <div className="relative group">
                                <div
                                    onClick={() => setIsMusicPickerOpen(!isMusicPickerOpen)}
                                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 shrink-0">
                                            <Music size={14} />
                                        </div>
                                        <div className="truncate">
                                            <div className="text-sm text-white font-medium truncate">{currentTrack.title}</div>
                                            <div className="text-[10px] text-white/40 truncate">{currentTrack.artist}</div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-wide px-2 group-hover:text-yellow-400 transition-colors">
                                        更换
                                    </div>
                                </div>

                                {/* Dropdown */}
                                {isMusicPickerOpen && (
                                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden max-h-48 overflow-y-auto shadow-2xl z-30">
                                        {PLAYLIST.map((track, idx) => (
                                            <div
                                                key={track.id}
                                                onClick={() => { setTrack(idx); setIsMusicPickerOpen(false); }}
                                                className={clsx(
                                                    "p-3 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors border-b border-white/5 last:border-0",
                                                    currentTrackIndex === idx ? "text-yellow-400 bg-yellow-400/5" : "text-white/60"
                                                )}
                                            >
                                                <span className="text-xs">{track.title}</span>
                                                {currentTrackIndex === idx && <Check size={12} />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sticky Footer */}
                    <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-sm space-y-3">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || photos.length === 0}
                            className={clsx(
                                "w-full py-3 text-black font-bold tracking-widest uppercase rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg",
                                (isSubmitting || photos.length === 0)
                                    ? "bg-zinc-800 text-white/30 cursor-not-allowed"
                                    : "bg-[#FFD700] hover:bg-[#ffed4a] hover:scale-[1.02] active:scale-[0.98]"
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>封存中...</span>
                                </>
                            ) : (
                                <>
                                    <span>永久封存记忆</span>
                                    <Upload size={16} />
                                </>
                            )}
                        </button>

                        <button
                            className="w-full py-3 bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 font-bold tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-2 text-xs"
                        >
                            <span>本地下载高清视频</span>
                        </button>

                        <div className="text-center px-2">
                            <p className="text-[10px] text-white/40 leading-relaxed">
                                点击封存即生成专属链接，可转发给特别的Ta
                            </p>
                        </div>
                    </div>
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                />

                {/* Payment/Poster Confirmation Modal */}
                <PaymentPosterModal
                    isOpen={showPayment}
                    onClose={() => setShowPayment(false)}
                    previewImage={previews[0]} // Use first uploaded photo as preview
                    onPaymentComplete={executeSubmission}
                />

            </div>
        </div>
    );
};
