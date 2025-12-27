import Share2 from 'lucide-react/dist/esm/icons/share-2';
import Star from 'lucide-react/dist/esm/icons/star';
import X from 'lucide-react/dist/esm/icons/x';

interface ShareModalProps {
    onPremiumShare: () => void;
    onGenericShare: () => void;
    onExit: () => void;
    isOpen: boolean;
}

export const ShareModal = ({ onPremiumShare, onGenericShare, onExit, isOpen }: ShareModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-lg animate-in fade-in duration-300 pointer-events-auto">
            <div className="w-full max-w-lg p-6 space-y-4">
                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
                        留住此刻感动
                    </h2>
                    <p className="text-white/50 text-sm">选择您的专属记忆保存方式</p>
                </div>

                {/* Option 1: Premium Share */}
                <button
                    onClick={onPremiumShare}
                    className="group relative w-full p-6 bg-gradient-to-r from-yellow-900/40 to-amber-900/40 border border-yellow-500/30 rounded-xl hover:border-yellow-400 hover:bg-yellow-900/60 transition-all text-left overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-2 bg-yellow-500 text-black text-xs font-bold rounded-bl-lg">
                        推荐
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-400 group-hover:scale-110 transition-transform">
                            <Star size={24} />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-yellow-100 group-hover:text-white">分享独家记忆</div>
                            <div className="text-xs text-yellow-200/50 mt-1">生成包含您上传照片的永久链接，发送给TA</div>
                        </div>
                    </div>
                </button>

                {/* Option 2: Generic Share */}
                <button
                    onClick={onGenericShare}
                    className="group w-full p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all text-left"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                            <Share2 size={24} />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-white/90">推荐胶囊项目</div>
                            <div className="text-xs text-white/40 mt-1">分享这个酷炫的项目给朋友 (不含照片)</div>
                        </div>
                    </div>
                </button>

                {/* Option 3: Exit */}
                <button
                    onClick={onExit}
                    className="group w-full p-4 flex items-center justify-center gap-2 text-white/30 hover:text-white/80 transition-colors uppercase tracking-widest text-sm"
                >
                    <X size={16} />
                    <span>退出并返回大厅</span>
                </button>
            </div>
        </div>
    );
};
