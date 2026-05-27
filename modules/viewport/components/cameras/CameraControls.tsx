"use client";

import { OrbitControls } from "@react-three/drei";

export default function CameraControls() {
  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.05}
      minDistance={2}
      maxDistance={20}
    />
  );
}
