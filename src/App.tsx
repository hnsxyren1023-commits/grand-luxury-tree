import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { SceneManager, type SceneType } from './components/SceneManager';
import { Interface } from './components/UI/Interface';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AudioManager } from './components/AudioManager';
import { useMediaPipe } from './hooks/useMediaPipe';
import { useDeviceCapabilities } from './hooks/useDeviceCapabilities';
import { useStore } from './stores/useStore';
import { AdminDashboard } from './components/Admin/Dashboard';
import { logEvent } from './lib/analytics';

// Static Configuration for Canvas to prevent context loss
const GL_CONFIG = {
  antialias: false,
  alpha: false,
  stencil: false,
  depth: true,
  powerPreference: 'high-performance' as const,
  failIfMajorPerformanceCaveat: true
};

const CAMERA_CONFIG = {
  position: [0, 0, 25] as [number, number, number],
  fov: 50
};

function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');

  // Simple Hash Router & Analytics
  useEffect(() => {
    // Router
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);

    // Analytics: Track Page View
    logEvent('page_view');

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const mediaPipe = useMediaPipe();
  const [currentScene, setCurrentScene] = useState<SceneType>('LOBBY');
  const deviceCaps = useDeviceCapabilities();
  const bloomOn = useStore(state => state.bloom);

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <ErrorBoundary>
      <div className="w-full h-screen bg-black overflow-hidden relative">
        {/* 3D Scene Layer */}
        <div className="absolute inset-0 z-0">
          <Canvas
            shadows
            dpr={[1, deviceCaps.maxDPR]}
            camera={CAMERA_CONFIG}
            gl={GL_CONFIG}
          >
            <color attach="background" args={['#000000']} />

            <Suspense fallback={null}>
              <SceneManager
                mediaPipe={mediaPipe}
                onSceneChange={setCurrentScene}
                starCount={deviceCaps.recommendedStarCount}
              />
            </Suspense>

            {/* Host-level Post-processing disabled for Standalone Project 1 to save Memory (OOM Fix)
               Visuals are rendered inside the Iframe.
            {!deviceCaps.isUltraLowMode && (
              <EffectComposer>
                <Bloom
                  luminanceThreshold={0.2}
                  mipmapBlur
                  intensity={bloomOn ? (deviceCaps.shouldReduceEffects ? 0.3 : 0.5) : 0}
                  radius={0.9}
                />
                <Noise opacity={deviceCaps.shouldReduceEffects ? 0.03 : 0.05} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
              </EffectComposer>
            )} */}
          </Canvas>
        </div>

        {/* 2D UI Overlay Layer */}
        <Interface
          currentScene={currentScene}
        />
        <AudioManager />

        <div id="debug-log" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
          color: 'red',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          background: 'rgba(0,0,0,0.5)'
        }}></div>

      </div>
    </ErrorBoundary>
  );
}

export default App;
