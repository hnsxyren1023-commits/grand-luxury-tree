import { useEffect, useRef, useState, useCallback } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision';

export interface HandData {
    results: HandLandmarkerResult | null;
    isFist: boolean;
    isOpen: boolean;
    cursor: { x: number, y: number };
}

export const useMediaPipe = () => {
    const [active, setActive] = useState(false);
    const [deviceName, setDeviceName] = useState<string>('OFFLINE');
    const [currentDeviceId, setCurrentDeviceId] = useState<string>('');
    const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
    const [isLocked, setIsLocked] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const landmarkerRef = useRef<HandLandmarker | null>(null);
    const rafId = useRef<number>(0);
    const streamRef = useRef<MediaStream | null>(null);

    const handData = useRef<HandData>({
        results: null,
        isFist: false,
        isOpen: false,
        cursor: { x: 0, y: 0 }
    });

    // Initialize MediaPipe
    useEffect(() => {
        if (landmarkerRef.current) return;

        const init = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
                );

                landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });
            } catch (err) {
                console.error("MediaPipe Init Error:", err);
            }
        };

        init();

        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
                landmarkerRef.current = null;
            }
            cancelAnimationFrame(rafId.current);
        };
    }, []);


    const detect = useCallback(() => {
        if (landmarkerRef.current && videoRef.current && videoRef.current.readyState >= 2) {
            try {
                const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
                handData.current.results = results;

                if (results.landmarks.length > 0) {
                    const lms = results.landmarks[0];

                    const palmY = lms[9].y;

                    const targetX = 1 - lms[9].x;
                    const targetY = palmY;

                    // Reduce smoothing lag for more direct response (0.2 -> 0.45)
                    handData.current.cursor.x += (targetX - handData.current.cursor.x) * 0.45;
                    handData.current.cursor.y += (targetY - handData.current.cursor.y) * 0.45;

                    // Calculate hand openness using distances between fingertips and palm base
                    // A more robust fist detection: distance between thumb tip(4) and pinky base(17) or middle tip(12)
                    // Let's use thumb base(1) to middle finger tip(12) vs thumb tip(4)
                    const thumbTip = lms[4];
                    const middleTip = lms[12];

                    const handSize = Math.sqrt(Math.pow(lms[5].x - lms[17].x, 2) + Math.pow(lms[5].y - lms[17].y, 2));
                    const fistDist = Math.sqrt(Math.pow(thumbTip.x - middleTip.x, 2) + Math.pow(thumbTip.y - middleTip.y, 2));

                    // Use relative distance to hand size for better robustness across distances
                    const isFistState = (fistDist / handSize) < 1.2;
                    const isOpenState = (fistDist / handSize) > 2.0;

                    handData.current.isFist = isFistState;
                    handData.current.isOpen = isOpenState;

                    // AUTO-LOCK: If we see a hand for more than a few frames, lock the camera source!
                    if (!isLocked) {
                        setIsLocked(true);
                    }
                } else {
                    handData.current.isFist = false;
                    handData.current.isOpen = false;
                }
            } catch (err) {
                console.error("Detection Error:", err);
            }
        }
        rafId.current = requestAnimationFrame(detect);
    }, [isLocked]);

    const startCamera = async (preferredId?: string) => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("您的浏览器不支持启用摄像头。");
            return;
        }

        try {
            // 1. Refresh permissions and device list
            let tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(d => d.kind === 'videoinput');
            setAvailableDevices(videoDevices);
            tempStream.getTracks().forEach(t => t.stop());

            // 2. Determine which device to use
            let targetId = preferredId || currentDeviceId;

            if (!targetId) {
                const droidCam = videoDevices.find(d => d.label.includes('DroidCam'));
                targetId = droidCam ? droidCam.deviceId : (videoDevices[0]?.deviceId || '');
            }

            const selectedDevice = videoDevices.find(d => d.deviceId === targetId);
            setDeviceName(selectedDevice?.label || 'Unknown Camera');
            setCurrentDeviceId(targetId);

            const constraints: MediaStreamConstraints = {
                video: {
                    deviceId: targetId ? { exact: targetId } : undefined,
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            // Clean up old stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                const onReady = () => {
                    if (videoRef.current) {
                        videoRef.current.play().catch(e => console.error("Video Play Error:", e));
                        setActive(true);
                        detect();
                    }
                };
                videoRef.current.onloadedmetadata = onReady;
                if (videoRef.current.readyState >= 2) onReady();
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setDeviceName('ERROR');
            alert("无法启动摄像头。请确保 DroidCam PC 端已运行并连接。");
        }
    };

    const switchCamera = async () => {
        // Enumerate devices again to ensure list is fresh
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setAvailableDevices(videoDevices);

        if (videoDevices.length <= 1) return;

        const currentIndex = videoDevices.findIndex(d => d.deviceId === currentDeviceId);
        const nextIndex = (currentIndex + 1) % videoDevices.length;
        const nextDevice = videoDevices[nextIndex];

        await startCamera(nextDevice.deviceId);
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setActive(false);
        setDeviceName('OFFLINE');
        cancelAnimationFrame(rafId.current);
    };

    return {
        videoRef,
        startCamera,
        stopCamera,
        switchCamera,
        active,
        handData,
        deviceName,
        isLocked,
        setIsLocked,
        hasMultipleCameras: availableDevices.length > 1
    };
};
