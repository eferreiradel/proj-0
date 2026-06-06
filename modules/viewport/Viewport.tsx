"use client"

import { Canvas } from "@react-three/fiber"
import Scene from "./components/Scene"
import SectionNav from "./components/ui/SectionNav/locales/SectionNav"
import RoofOptions from "./components/ui/RoofOptions"
import ColorPicker from "./components/ui/ColorPicker"
import InteriorModeSwitch from "./components/ui/InteriorMode"
import GalleyWip from "./components/ui/GalleyWip"
import LoadingScreen from "./components/ui/LoadingScreen"
import { useConfigStore } from "./store/useConfigStore"

export default function Viewport() {
  const isLoaded = useConfigStore((s) => s.isLoaded)

  return (
    <div className="relative w-full flex-1 overflow-hidden" style={{ background: "radial-gradient(ellipse at center, #4a4a4a 0%, #1a1a1a 100%)" }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [15.71, 1.76, -0.88], fov: 23 }}
        performance={{ min: 0.5 }}
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

          {/* Big title overlay */}
          {
            /**
             * 
          <h1 className="pointer-events-none absolute labsolute inset-30 font-[family-name:var(--font-heading)] text-6xl md:text-8xl lg:text-9xl leading-none tracking-tight text-white/90 drop-shadow-lg">
            TEAR
          </h1>
           <h1 className="pointer-events-none absolute labsolute inset-60 font-[family-name:var(--font-heading)] text-6xl md:text-8xl lg:text-9xl leading-none tracking-tight text-white/90 drop-shadow-lg">
            DROP
          </h1>
             */
          }
          

          {/* Top nav */}

            <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-6">
              <div className="pointer-events-auto">
                <SectionNav />
              </div>
            </div>
        
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-6">
              <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm transition-all duration-300">
                <RoofOptions />
                <ColorPicker />
                <InteriorModeSwitch />
                <GalleyWip />
              </div>
            </div>

          {/* Bottom card — section controls, expands/contracts to fit content */}
        </>
      )}

      {/* Loading Screen */}
      <LoadingScreen />
    </div>
  )
}
