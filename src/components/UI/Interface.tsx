import { useState } from 'react';
import clsx from 'clsx';
import Music from 'lucide-react/dist/esm/icons/music';
import Settings from 'lucide-react/dist/esm/icons/settings';
import Check from 'lucide-react/dist/esm/icons/check';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';

import { useStore } from '../../stores/useStore';
import { useViralStore } from '../../lib/viralStore';
import { LandingOverlay } from '../Viral/LandingOverlay';
import { CapsuleCreator } from '../Viral/CapsuleCreator';
import { ViewCapsule } from '../Viral/ViewCapsule';
import { ShareModal } from '../Viral/ShareModal';
import { PaymentPosterModal } from '../Viral/PaymentPosterModal';
import { ProjectRecommendationModal } from '../Viral/ProjectRecommendationModal';


interface InterfaceProps {

    currentScene: string;
}

export const Interface = ({ currentScene }: InterfaceProps) => {
    const isLobby = currentScene === 'LOBBY';
    const [showSettings, setShowSettings] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    // Poster States
    const [showPaymentPoster, setShowPaymentPoster] = useState(false);
    const [showRecommendationPoster, setShowRecommendationPoster] = useState(false);

    // Global Store
    const fx = useStore();
    const { toggleFx, audio: audioOn } = fx;

    const toggleAudio = () => {
        toggleFx('audio');
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
            {/* Header (Lobby Only) */}
            <header className={clsx(
                "pt-[4%] text-center pointer-events-auto transition-all duration-1000",
                isLobby ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 invisible"
            )}>
                <h1 className="text-[60px] font-black tracking-[5px] text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#aa771c] drop-shadow-[0_0_30px_rgba(255,215,0,0.3)] m-0" style={{ fontFamily: '"Times New Roman", serif', backgroundSize: '200% auto', animation: 'shine 3s linear infinite' }}>
                    圣诞老人的口袋
                </h1>
                <div className="text-[#666] text-[12px] tracking-[8px] mt-[10px] uppercase">
                    2026 圣诞记忆胶囊
                </div>
            </header>

            {/* Controls Area: Bottom Right Global Actions */}
            {currentScene !== 'PROJECT_1' && (
                <div className={clsx(
                    "absolute bottom-[30px] right-[30px] flex gap-[15px] items-end pointer-events-auto transition-all duration-500",
                    // Always visible now
                )}>
                    {/* Back / Share Button (Only in Project Mode) */}
                    {!isLobby && (
                        <button
                            onClick={() => setShowShareModal(true)}
                            className={clsx(
                                "w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300",
                                "bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.2)] backdrop-blur-[5px]",
                                "text-[#ccc] hover:border-[#FFD700] hover:text-[#FFD700] hover:scale-110",
                                "shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                            )}
                            title="返回 / 分享"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}

                    {/* Camera Toggle - Removed, now using CameraPreview overlay */}

                    {/* Audio Toggle */}
                    <button
                        onClick={toggleAudio}
                        className={clsx(
                            "w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300",
                            "border backdrop-blur-[5px]",
                            audioOn
                                ? "bg-[rgba(255,215,0,0.15)] border-[#FFD700] text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                                : "bg-[rgba(0,0,0,0.6)] border-[rgba(255,255,255,0.2)] text-[#ccc] hover:border-[#FFD700] hover:text-[#FFD700] hover:scale-110"
                        )}
                        title="开启音效"
                    >
                        <Music size={20} />
                    </button>

                    {/* Settings Toggle */}
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={clsx(
                            "w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300",
                            "border backdrop-blur-[5px]",
                            showSettings
                                ? "bg-[rgba(255,215,0,0.15)] border-[#FFD700] text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                                : "bg-[rgba(0,0,0,0.6)] border-[rgba(255,255,255,0.2)] text-[#ccc] hover:border-[#FFD700] hover:text-[#FFD700] hover:scale-110"
                        )}
                        title="特效设置"
                    >
                        <Settings size={20} />
                    </button>
                </div>
            )}

            {/* Settings Menu */}
            <div className={clsx(
                "absolute bottom-[100px] right-[30px] w-[180px] p-[15px]",
                "bg-[rgba(10,10,10,0.9)] border border-[rgba(255,255,255,0.1)] rounded-[12px]",
                "backdrop-blur-[15px]",
                "transition-all duration-300 origin-bottom-right pointer-events-auto",
                showSettings ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-[20px] scale-95 pointer-events-none"
            )}>
                <div className="text-[10px] text-[#666] border-b border-[#333] pb-[5px] mb-[10px]">视觉特效</div>

                <div onClick={() => toggleFx('breath')} className={clsx("flex items-center mb-[12px] cursor-pointer text-[12px] transition-colors", fx.breath ? "text-white" : "text-[#aaa]")}>
                    <div className={clsx("w-[14px] h-[14px] border mr-[10px] flex items-center justify-center", fx.breath ? "bg-[#FFD700] border-[#FFD700] text-black" : "border-[#555] bg-transparent")}>
                        {fx.breath && <Check size={10} strokeWidth={4} />}
                    </div>
                    <span>💓 卡牌呼吸</span>
                </div>

                <div onClick={() => toggleFx('bloom')} className={clsx("flex items-center mb-[12px] cursor-pointer text-[12px] transition-colors", fx.bloom ? "text-white" : "text-[#aaa]")}>
                    <div className={clsx("w-[14px] h-[14px] border mr-[10px] flex items-center justify-center", fx.bloom ? "bg-[#FFD700] border-[#FFD700] text-black" : "border-[#555] bg-transparent")}>
                        {fx.bloom && <Check size={10} strokeWidth={4} />}
                    </div>
                    <span>✨ 全局辉光</span>
                </div>

                <div onClick={() => toggleFx('stars')} className={clsx("flex items-center mb-[12px] cursor-pointer text-[12px] transition-colors", fx.stars ? "text-white" : "text-[#aaa]")}>
                    <div className={clsx("w-[14px] h-[14px] border mr-[10px] flex items-center justify-center", fx.stars ? "bg-[#FFD700] border-[#FFD700] text-black" : "border-[#555] bg-transparent")}>
                        {fx.stars && <Check size={10} strokeWidth={4} />}
                    </div>
                    <span>🌌 多层星空</span>
                </div>

                <div onClick={() => toggleFx('border')} className={clsx("flex items-center mb-[12px] cursor-pointer text-[12px] transition-colors", fx.border ? "text-white" : "text-[#aaa]")}>
                    <div className={clsx("w-[14px] h-[14px] border mr-[10px] flex items-center justify-center", fx.border ? "bg-[#FFD700] border-[#FFD700] text-black" : "border-[#555] bg-transparent")}>
                        {fx.border && <Check size={10} strokeWidth={4} />}
                    </div>
                    <span>⚡ 流动金线</span>
                </div>

                <div onClick={() => toggleFx('holo')} className={clsx("flex items-center mb-[12px] cursor-pointer text-[12px] transition-colors", fx.holo ? "text-white" : "text-[#aaa]")}>
                    <div className={clsx("w-[14px] h-[14px] border mr-[10px] flex items-center justify-center", fx.holo ? "bg-[#FFD700] border-[#FFD700] text-black" : "border-[#555] bg-transparent")}>
                        {fx.holo && <Check size={10} strokeWidth={4} />}
                    </div>
                    <span>💎 全息镭射</span>
                </div>

                <div onClick={() => toggleFx('dust')} className={clsx("flex items-center mb-[12px] cursor-pointer text-[12px] transition-colors", fx.dust ? "text-white" : "text-[#aaa]")}>
                    <div className={clsx("w-[14px] h-[14px] border mr-[10px] flex items-center justify-center", fx.dust ? "bg-[#FFD700] border-[#FFD700] text-black" : "border-[#555] bg-transparent")}>
                        {fx.dust && <Check size={10} strokeWidth={4} />}
                    </div>
                    <span>🌟 前景金尘</span>
                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={showShareModal}
                onExit={() => { setShowShareModal(false); (window as any).returnToLobby(); }}
                onGenericShare={() => {
                    setShowShareModal(false);
                    setShowRecommendationPoster(true);
                }}
                onPremiumShare={() => {
                    setShowShareModal(false);
                    setShowPaymentPoster(true);
                }}
            />

            {/* New Viral Posters */}
            <PaymentPosterModal
                isOpen={showPaymentPoster}
                onClose={() => setShowPaymentPoster(false)}
                // Determine image based on currentScene
                previewImage={
                    currentScene === 'PROJECT_1' ? '/projects/project1/preview.jpg' :
                        currentScene === 'PROJECT_2' ? '/projects/project2/preview.jpg' :
                            currentScene === 'PROJECT_3' ? '/projects/project3/preview.jpg' :
                                "" // Default fallback in modal
                }
                onPaymentComplete={() => {
                    setShowPaymentPoster(false);
                    useViralStore.getState().setMode('CAPSULE_MODE');
                }}
            />

            <ProjectRecommendationModal
                isOpen={showRecommendationPoster}
                onClose={() => setShowRecommendationPoster(false)}
            />

            {/* Viral Overlay */}
            <LandingOverlay />
            <CapsuleCreator />
            <ViewCapsule />


        </div>
    );
};
