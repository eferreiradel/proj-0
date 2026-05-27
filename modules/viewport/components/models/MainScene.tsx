"use client";

import { useGLTF } from "@react-three/drei";
import { useState, useEffect } from "react";

const MODEL_PATH = "/3d/scene/main.glb";

export default function MainScene() {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(MODEL_PATH, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) setHasError(true);
        else setLoaded(true);
      })
      .catch(() => setHasError(true));
  }, []);

  if (hasError) return <FallbackScene />;
  if (!loaded) return null;

  return <LoadedModel />;
}

function LoadedModel() {
  const { scene } = useGLTF(MODEL_PATH, true);
  return <primitive object={scene} />;
}

function FallbackScene() {
  return (
    <group>
      {/* Grid floor */}
      <gridHelper args={[10, 10, "#888888", "#444444"]} />
      {/* Placeholder cube */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4f46e5" wireframe />
      </mesh>
    </group>
  );
}
