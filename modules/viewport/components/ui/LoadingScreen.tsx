"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useConfigStore } from "@/modules/viewport/store/useConfigStore";

export default function LoadingScreen() {
  const { active, progress, loaded, total } = useProgress();
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const setIsLoaded = useConfigStore((s) => s.setIsLoaded);

  useEffect(() => {
    // Wait until loading is done AND at least some assets were loaded
    const done = !active && total > 0 && loaded >= total;
    if (done && visible) {
      const timer = setTimeout(() => {
        setOpacity(0);
        setIsLoaded(true);
        setTimeout(() => setVisible(false), 600);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [active, loaded, total, visible, setIsLoaded]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at center, #4a4a4a 0%, #1a1a1a 100%)",
        opacity,
        transition: "opacity 0.6s ease",
        pointerEvents: opacity === 1 ? "auto" : "none",
      }}
    >
      <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin mb-6" />
      <p className="text-white/50 text-sm tracking-widest uppercase">
        Loading {Math.round(progress)}%
      </p>
    </div>
  );
}
