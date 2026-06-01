"use client"

import { Canvas } from "@react-three/fiber"
import Scene from "./components/Scene"
import SectionNav from "./components/ui/SectionNav/locales/SectionNav"
import RoofOptions from "./components/ui/RoofOptions"
import ColorPicker from "./components/ui/ColorPicker"
import LoadingScreen from "./components/ui/LoadingScreen"
import { useConfigStore } from "./store/useConfigStore"

export default function Viewport() {
  const isLoaded = useConfigStore((s) => s.isLoaded)

  return (
    <div className="relative w-full flex-1 overflow-hidden" style={{ background: "radial-gradient(ellipse at center, #4a4a4a 0%, #1a1a1a 100%)" }}>
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [15.71, 1.76, -0.88], fov: 23 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>

      {/* UI overlay — only after everything is loaded */}
      {isLoaded && (
        <>
          {/* Version label */}
          <div className="pointer-events-none absolute left-4 top-4 text-xs text-white/40 font-mono">
            proj-0 alpha v1.2
          </div>

          {/* Top nav */}
          <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-6">
            <div className="pointer-events-auto">
              <SectionNav />
            </div>
          </div>

          {/* Config panel — right on desktop, bottom sheet on mobile */}
          <div className="pointer-events-none absolute inset-0 hidden md:flex items-center justify-end pr-6">
            <div className="pointer-events-auto">
              <RoofOptions />
              <ColorPicker />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex md:hidden justify-center pb-0">
            <div className="pointer-events-auto w-full">
              <RoofOptions mobile />
              <ColorPicker mobile />
            </div>
          </div>
        </>
      )}

      {/* Loading Screen */}
      <LoadingScreen />
    </div>
  )
}
