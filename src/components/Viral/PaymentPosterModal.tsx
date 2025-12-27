import { useState } from 'react';
import { X, Loader2, CheckCircle2, Lock, Smartphone } from 'lucide-react';
import clsx from 'clsx';

interface PaymentPosterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentComplete: () => void;
    previewImage: string;
}

export const PaymentPosterModal = ({ isOpen, onClose, onPaymentComplete, previewImage }: PaymentPosterModalProps) => {
    const [isPaying, setIsPaying] = useState(false);

    if (!isOpen) return null;

    const handleSimulatedPayment = () => {
        setIsPaying(true);
        // Simulate network/processing
        setTimeout(() => {
            setIsPaying(false);
            onPaymentComplete();
        }, 2000);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto">
            {/* Dark & Gold Theme Container */}
            <div className={clsx(
                "relative w-full max-w-sm bg-[#1a1a1a] text-white rounded-xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(255,215,0,0.2)] transition-all duration-500 border border-white/10",
                "max-h-[85vh] h-auto"
            )}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 text-white/50 hover:text-white bg-black/20 rounded-full p-1 transition-colors"
                >
                    <X size={18} />
                </button>

                {/* 1. Header with Dynamic Preview */}
                <div className="relative h-48 sm:h-56 bg-black flex items-center justify-center overflow-hidden shrink-0">
                    {/* Dynamic Image Background */}
                    <div className="absolute inset-0">
                        <img
                            src={previewImage || "https://images.unsplash.com/photo-1544084944-152696a63f72?q=80&w=1000&auto=format&fit=crop"}
                            className="w-full h-full object-cover opacity-60 blur-sm scale-110" // Blurry background
                            alt="Preview BG"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]" />
                    </div>

                    {/* Clear Center Image */}
                    <div className="relative z-10 w-24 h-36 rounded-lg overflow-hidden border border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)] rotate-3">
                        <img
                            src={previewImage || "https://images.unsplash.com/photo-1544084944-152696a63f72?q=80&w=1000&auto=format&fit=crop"}
                            className="w-full h-full object-cover"
                            alt="Preview Card"
                        />
                    </div>

                    <div className="absolute bottom-4 z-10 text-center w-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-[#FFD700]/30 text-[#FFD700] text-[10px] tracking-widest uppercase">
                            <Lock size={10} />
                            <span>Exclusive Memory</span>
                        </div>
                    </div>
                </div>

                {/* 2. Compact Content Area */}
                <div className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-serif text-white italic tracking-wider">Unlocking...</h2>
                        <p className="text-xs text-white/40 mt-1 uppercase tracking-[2px]">获取您的专属记忆胶囊</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-3 items-center p-3 rounded-lg bg-white/5 border border-white/5">
                            <CheckCircle2 className="text-[#FFD700] shrink-0" size={16} />
                            <div>
                                <span className="font-bold text-sm text-white/90">4K 原图导出</span>
                                <p className="text-[10px] text-white/50">保存无损画质，永久留存。</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center p-3 rounded-lg bg-white/5 border border-white/5">
                            <CheckCircle2 className="text-[#FFD700] shrink-0" size={16} />
                            <div>
                                <span className="font-bold text-sm text-white/90">去除品牌水印</span>
                                <p className="text-[10px] text-white/50">纯净视觉体验，仅展示您的内容。</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center p-3 rounded-lg bg-white/5 border border-white/5">
                            <CheckCircle2 className="text-[#FFD700] shrink-0" size={16} />
                            <div>
                                <span className="font-bold text-sm text-white/90">生成动态视频</span>
                                <p className="text-[10px] text-white/50">让胶囊中的记忆动起来。</p>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Simulation (Compact & Larger) */}
                    <div className="mt-4 flex items-center justify-center gap-4 opacity-90">
                        <div className="w-24 h-24 bg-white p-2 rounded-lg shadow-lg">
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-400">QR Code</div>
                        </div>
                    </div>
                </div>

                {/* 3. Compact Footer Action */}
                <div className="p-4 bg-black/40 backdrop-blur z-10 border-t border-white/5">
                    <button
                        onClick={handleSimulatedPayment}
                        disabled={isPaying}
                        className={clsx(
                            "w-full py-3 rounded-lg font-bold text-black text-sm tracking-widest transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] active:scale-[0.98]",
                            isPaying ? "bg-gray-600 cursor-wait text-white" : "bg-[#FFD700] hover:bg-yellow-400"
                        )}
                    >
                        {isPaying ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin" size={16} />
                                <span>确认中...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Smartphone size={16} />
                                <span>立即支付 ¥9.90</span>
                            </div>
                        )}
                    </button>
                    {/* Removed Refund Text as requested */}
                </div>

            </div>
        </div>
    );
};
