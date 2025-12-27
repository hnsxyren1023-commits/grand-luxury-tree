import { Html } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useMediaPipe } from '../../hooks/useMediaPipe';

interface ProjectShellProps {
    projectUrl: string;
    mediaPipe: ReturnType<typeof useMediaPipe>;
}

export const ProjectShell = ({ projectUrl, mediaPipe }: ProjectShellProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        let animId: number;
        const sync = () => {
            if (!iframeRef.current) return;
            const hand = mediaPipe.handData.current;

            // Only sync if we have valid hand data
            if (hand && hand.results && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                    type: 'GESTURE_SYNC',
                    data: hand
                }, '*');
            }
            animId = requestAnimationFrame(sync);
        };
        sync();
        return () => cancelAnimationFrame(animId);
    }, [mediaPipe]);

    return (
        <Html fullscreen style={{ pointerEvents: 'auto', zIndex: 5 }}>
            {/* Project Iframe */}
            <iframe
                ref={iframeRef}
                src={projectUrl}
                style={{ width: '100vw', height: '100vh', border: 'none', background: 'black' }}
                title="Project View"
            />

            {/* Unified UI Overlay - Logic moved to Interface.tsx */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Note: Camera Preview is handled globally by Mirror component */}
            </div>
        </Html>
    );
};
