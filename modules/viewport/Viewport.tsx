"use client"

import { Canvas } from "@react-three/fiber"
import Scene from "./components/Scene"
import SectionNav from "./components/ui/SectionNav/locales/SectionNav"
import RoofOptions from "./components/ui/RoofOptions"

export default function Viewport() {
  return (
    <div className="relative w-full flex-1" style={{ background: "radial-gradient(ellipse at center, #e0e0e0 0%, #6b6b6b 100%)" }}>
      <Canvas
        shadows
        camera={{ position: [15.71, 1.76, -0.88], fov: 23 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>

      {/* Top nav */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-6">
        <div className="pointer-events-auto">
          <SectionNav />
        </div>
      </div>

      {/* Right panel */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-6">
        <div className="pointer-events-auto">
          <RoofOptions />
        </div>
      </div>
    </div>
  )
}
