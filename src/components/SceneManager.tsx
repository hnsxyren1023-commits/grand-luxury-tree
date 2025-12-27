import { useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useMediaPipe } from "../hooks/useMediaPipe";
import { ProjectShell } from "./UI/ProjectShell";

export type SceneType = "LOBBY" | "PROJECT_1" | "PROJECT_2" | "PROJECT_3";

interface SceneManagerProps {
  mediaPipe: ReturnType<typeof useMediaPipe>;
  onSceneChange?: (scene: SceneType) => void;
  starCount?: number;
}

export const SceneManager = ({ mediaPipe, onSceneChange }: SceneManagerProps) => {
  const { camera } = useThree();

  // FORCE PROJECT 1 (Standalone Mode)
  // const [currentScene] = useState<SceneType>("PROJECT_1");

  useEffect(() => {
    // Sync state to App.tsx
    onSceneChange?.('PROJECT_1');

    // Reset camera for Project 1
    camera.position.set(0, 0, 45);
    camera.lookAt(0, 0, 0);
  }, [camera, onSceneChange]);

  return (
    <group>
      <Suspense fallback={null}>
        {/* Directly render Project 1 content */}
        <ProjectShell projectUrl="/projects/project1/index.html" mediaPipe={mediaPipe} />
      </Suspense>
    </group>
  );
};
