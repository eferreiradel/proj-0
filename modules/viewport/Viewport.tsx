"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";

export default function Viewport() {
  return (
    <div className="w-full flex-1">
      <Canvas
        shadows
        camera={{ position: [3, 3, 3], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
