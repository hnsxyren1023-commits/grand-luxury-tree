import { X, Trophy, Users, Camera } from 'lucide-react';
import clsx from 'clsx';
// import { PROJECTS } from '../../data/projects'; // Remove this and hardcode to avoid import error if data/projects doesn't exist

interface ProjectRecommendationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProjectRecommendationModal = ({ isOpen, onClose }: ProjectRecommendationModalProps) => {
    if (!isOpen) return null;

    // Use projects data but style it as a leaderboard
    const topProjects = [
        { id: '1', rank: 1, label: "🎄 斐波那契粒子树", hot: "9.9w" },
        { id: '2', rank: 2, label: "🌌 记忆回廊 (DNA)", hot: "8.5w" },
        { id: '3', rank: 3, label: "✨ 黑金奢华 (PBR)", hot: "7.2w" },
    ];

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto">
            {/* Red/Gold Poster Container */}
            <div className="relative w-full max-w-sm aspect-[9/16] bg-gradient-to-b from-[#8B0000] via-[#A52A2A] to-[#3a0000] rounded-xl shadow-[0_0_50px_rgba(255,0,0,0.3)] border border-[#FFD700] overflow-hidden flex flex-col items-center text-[#FFD700]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 text-white/50 hover:text-white"
                >
                    <X size={24} />
                </button>

                {/* Decoration: Snow/Stars */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                {/* Title */}
                <div className="mt-12 text-center z-10">
                    <div className="text-white/80 text-xs tracking-[5px] mb-2 uppercase">Christmas 2026</div>
                    <h2 className="text-3xl font-black italic tracking-tighter drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">
                        必玩特效榜
                    </h2>
                    <div className="w-16 h-1 bg-[#FFD700] mx-auto mt-2 rounded-full shadow-[0_0_10px_#FFD700]" />
                </div>

                {/* List */}
                <div className="flex-1 w-full px-6 mt-8 space-y-4 z-10">
                    {topProjects.map((item) => (
                        <div key={item.id} className="group relative bg-black/20 border border-[#FFD700]/30 rounded-lg p-3 flex items-center gap-4 hover:bg-[#FFD700]/10 transition-colors cursor-pointer">
                            {/* Rank Badge */}
                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg",
                                item.rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                                    item.rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                                        "bg-gradient-to-br from-yellow-700 to-yellow-900"
                            )}>
                                {item.rank}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-white">{item.label}</h3>
                                <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                                    <Users size={10} />
                                    <span>{item.hot} 人正在体验</span>
                                </div>
                            </div>

                            {/* Action Icon */}
                            <div className="text-[#FFD700]/50 group-hover:text-[#FFD700] transition-colors">
                                <Camera size={16} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="w-full p-6 z-10 bg-gradient-to-t from-black/80 to-transparent">
                    <button className="w-full py-4 bg-[#FFD700] text-[#8B0000] font-black tracking-widest uppercase rounded-full shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform active:scale-95 flex items-center justify-center gap-2">
                        <Trophy size={18} />
                        <span>立即挑战 TOP 1</span>
                    </button>
                    <div className="text-center text-white/30 text-[10px] mt-4">
                        长按保存海报 · 分享给好友
                    </div>
                </div>

            </div>
        </div>
    );
};
