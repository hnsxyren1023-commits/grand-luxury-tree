import { useState, useEffect } from 'react';

interface DeviceCapabilities {
    isMobile: boolean;
    isTablet: boolean;
    isTouchDevice: boolean;
    gpuTier: 'high' | 'medium' | 'low';
    maxDPR: number;
    shouldReduceEffects: boolean;
    recommendedStarCount: number;
    isUltraLowMode: boolean;
}

/**
 * Smart device detection hook that adapts quality based on actual device capabilities
 * Not a blanket mobile limitation - detects GPU power and adjusts accordingly
 */
export function useDeviceCapabilities(): DeviceCapabilities {
    const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
        isMobile: false,
        isTablet: false,
        isTouchDevice: false,
        gpuTier: 'high',
        maxDPR: 2,
        shouldReduceEffects: false,
        recommendedStarCount: 1500,
        isUltraLowMode: false
    });

    useEffect(() => {
        const detectCapabilities = async () => {
            // 1. Basic device detection
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            // 2. Viewport detection
            const viewportWidth = window.innerWidth;
            const isSmallScreen = viewportWidth < 768;

            // 3. GPU Tier Detection (WebGL capabilities)
            let gpuTier: 'high' | 'medium' | 'low' = 'medium';
            let maxDPR = 2;
            let shouldReduceEffects = false;
            let recommendedStarCount = 1500;
            let isUltraLowMode = false;

            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

                if (gl) {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';

                    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

                    const isHighEndDesktop = (
                        /nvidia|geforce (rtx|gtx)|quadro|amd|radeon (rx|pro)|apple m[1-9]/i.test(renderer) ||
                        maxTextureSize >= 16384
                    );

                    const isHighEndMobile = (
                        /apple a1[5-9]|apple a[2-9][0-9]|adreno (7|8|9)|mali-g[7-9]|mali-g[1-9][0-9]/i.test(renderer) ||
                        (isMobile && maxTextureSize >= 16384)
                    );

                    const isLowEnd = (
                        /intel.*hd [2-5]|powervr|adreno [2-5]|mali-[2-5]/i.test(renderer) ||
                        maxTextureSize < 8192
                    );

                    if (isLowEnd) {
                        gpuTier = 'low';
                        maxDPR = 1;
                        shouldReduceEffects = true;
                        recommendedStarCount = 400;
                    } else if (isHighEndDesktop || isHighEndMobile) {
                        gpuTier = 'high';
                        maxDPR = window.devicePixelRatio > 1.5 ? 2 : 1.5;
                        shouldReduceEffects = false;
                        recommendedStarCount = isHighEndMobile ? 1000 : 1500;
                    } else {
                        gpuTier = 'medium';
                        maxDPR = isSmallScreen ? 1 : 1.5;
                        shouldReduceEffects = isSmallScreen;
                        recommendedStarCount = 800;
                    }

                    // Memory-based adjustment
                    if ('deviceMemory' in navigator) {
                        const deviceMemory = (navigator as any).deviceMemory;
                        if (deviceMemory < 4) {
                            shouldReduceEffects = true;
                            isUltraLowMode = true;
                            recommendedStarCount = Math.min(recommendedStarCount, 300);
                            maxDPR = 1;
                        }
                    }
                }
            } catch (e) {
                gpuTier = 'low';
                maxDPR = 1;
                shouldReduceEffects = true;
                recommendedStarCount = 300;
                isUltraLowMode = true;
            }

            setCapabilities({
                isMobile,
                isTablet,
                isTouchDevice,
                gpuTier,
                maxDPR,
                shouldReduceEffects,
                recommendedStarCount,
                isUltraLowMode
            });
        };

        detectCapabilities();
    }, []);

    return capabilities;
}
