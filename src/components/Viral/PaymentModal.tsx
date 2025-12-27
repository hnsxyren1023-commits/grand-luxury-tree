import { useState } from 'react';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';

interface PaymentModalProps {
    onClose: () => void;
    onSuccess: () => void;
    onSelectFree: () => void;
}

export const PaymentModal = ({ onClose, onSuccess, onSelectFree }: PaymentModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePay = () => {
        setIsProcessing(true);
        // Simulate payment delay
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-zinc-900 border border-yellow-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

                <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-400">
                        <CreditCard size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">升级高级版</h2>
                    <p className="text-white/50 text-sm">将珍贵的记忆永久封存</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-lg flex justify-between items-center border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <Check size={16} />
                            </div>
                            <div className="text-left">
                                <div className="text-white font-medium">永久云端存储</div>
                                <div className="text-xs text-white/50">永不过期 Safe & Secure</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg flex justify-between items-center border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                <Check size={16} />
                            </div>
                            <div className="text-left">
                                <div className="text-white font-medium">高清原图保存</div>
                                <div className="text-xs text-white/50">保持原始分辨率</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handlePay}
                        disabled={isProcessing}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-500/20"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={18} className="animate-spin" /> 处理中...
                            </>
                        ) : (
                            <>
                                支付 ¥6.66 (限时优惠)
                            </>
                        )}
                    </button>
                    <button
                        onClick={onSelectFree}
                        className="w-full py-3 text-white/50 hover:text-white text-sm"
                    >
                        继续使用免费版 (体验7天)
                    </button>
                </div>
            </div>
        </div>
    );
};
