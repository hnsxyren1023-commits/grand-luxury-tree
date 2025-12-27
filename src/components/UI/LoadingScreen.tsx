import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

interface LoadingScreenProps {
    onLoadComplete?: () => void;
}

export const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
    const { progress, active } = useProgress();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (progress === 100 && !active) {
            // Wait a bit then fade out
            const timer = setTimeout(() => {
                setIsVisible(false);
                onLoadComplete?.();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [progress, active, onLoadComplete]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-1000"
            style={{ opacity: progress === 100 ? 0 : 1 }}
        >
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(circle at center, rgba(191,149,63,0.1) 0%, transparent 70%)',
                    animation: 'pulse 3s ease-in-out infinite'
                }}></div>
            </div>

            {/* Center Content */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Spinning Prism Logo */}
                <div className="relative w-32 h-32">
                    <div
                        className="absolute inset-0 border-4 border-transparent"
                        style={{
                            borderTopColor: '#bf953f',
                            borderRightColor: '#fcf6ba',
                            borderBottomColor: '#aa771c',
                            borderLeftColor: '#fbf5b7',
                            borderRadius: '20%',
                            animation: 'spin 2s linear infinite',
                            boxShadow: '0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 40px rgba(255, 215, 0, 0.2)'
                        }}
                    ></div>
                    <div
                        className="absolute inset-4 border-2 border-transparent"
                        style={{
                            borderTopColor: '#fcf6ba',
                            borderRightColor: '#aa771c',
                            borderBottomColor: '#bf953f',
                            borderLeftColor: '#fbf5b7',
                            borderRadius: '30%',
                            animation: 'spin 3s linear infinite reverse'
                        }}
                    ></div>
                </div>

                {/* Title */}
                <h1
                    className="text-4xl font-black tracking-[5px] text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#aa771c]"
                    style={{
                        fontFamily: '"Times New Roman", serif',
                        textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
                    }}
                >
                    灵境棱镜
                </h1>

                {/* Progress Bar */}
                <div className="w-64 h-1 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#aa771c] transition-all duration-300 ease-out"
                        style={{
                            width: `${progress}%`,
                            boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                        }}
                    ></div>
                </div>

                {/* Loading Text */}
                <div className="text-[#666] text-sm tracking-[4px] uppercase">
                    Loading Ethereal Prism... {Math.round(progress)}%
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
};
