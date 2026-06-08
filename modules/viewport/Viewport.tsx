"use client"

import { Canvas } from "@react-three/fiber"
import Scene from "./components/Scene"
import Topbar from "./components/ui/panel/Topbar"
import Panel from "./components/ui/panel/Panel"
import HdriSwitcher from "./components/ui/HdriSwitcher"
import HdriTweaks from "./components/ui/HdriTweaks"
import LoadingScreen from "./components/ui/LoadingScreen"
import { useConfigStore } from "./store/useConfigStore"
import { STEPS } from "./config/configurator"

export default function Viewport() {
  const isLoaded = useConfigStore((s) => s.isLoaded)
  const activeSection = useConfigStore((s) => s.activeSection)
  const step = STEPS.find((s) => s.id === activeSection)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#f5f5f4]">
      {/* Topbar */}
      {isLoaded && <Topbar />}

      {/* Workspace: panel + viewport */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel (left) — hidden on small screens */}
        {isLoaded && (
          <div className="hidden md:flex">
            <Panel />
          </div>
        )}

        {/* Viewport (right) */}
        <div
          className="relative flex-1 overflow-hidden"
          style={{ background: "radial-gradient(ellipse at center, #ffffff 0%, #d6d6d6 100%)" }}
        >
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            camera={{ position: [15.71, 1.76, -0.88], fov: 23 }}
            performance={{ min: 0.5 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Scene />
          </Canvas>

          {isLoaded && (
            <>
              {/* vp-badge */}
              <div className="pointer-events-none absolute left-3.5 top-3.5 rounded-full border-[0.5px] border-black/10 bg-white px-2.5 py-1 text-[11px] text-gray-500">
                {step?.title}
              </div>

              {/* vp-hint */}
              <div className="pointer-events-none absolute bottom-3.5 left-1/2 -translate-x-1/2 text-[11px] text-gray-500">
                Drag to orbit · scroll to zoom
              </div>

              {/* version label */}
              <div className="pointer-events-none absolute right-3.5 top-3.5 font-mono text-[11px] text-gray-400">
                proj-0 alpha v1.2
              </div>

              {/* HDRI switcher + tweaks */}
              {
                /**
                 <div className="absolute bottom-3.5 right-3.5 flex max-w-[70%] flex-col items-end gap-2">
                   <HdriTweaks />
                   <HdriSwitcher />
                 </div>
                 */
              }
            </>
          )}
        </div>
      </div>

      {/* Loading Screen */}
      <LoadingScreen />
    </div>
  )
}
