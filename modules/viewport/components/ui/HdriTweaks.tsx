"use client";

import { useState } from "react";
import { Sliders } from "lucide-react";
import { useLightingStore } from "./LightingDebug";

export default function HdriTweaks() {
  const params = useLightingStore((s) => s.params);
  const setParams = useLightingStore((s) => s.setParams);
  const [open, setOpen] = useState(false);

  const set = (key: "environmentIntensity" | "environmentRotation", value: number) =>
    setParams({ ...params, [key]: value });

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Lighting tweaks"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-lg backdrop-blur-sm border border-black/5 transition-colors hover:text-gray-900"
      >
        <Sliders className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="w-56 rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur-sm border border-black/5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400">
          Lighting
        </span>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-900">
          ✕
        </button>
      </div>

      <label className="mb-1 block text-[11px] text-gray-600">
        Intensity: {params.environmentIntensity.toFixed(2)}
      </label>
      <input
        type="range"
        min={0}
        max={1.5}
        step={0.05}
        value={params.environmentIntensity}
        onChange={(e) => set("environmentIntensity", parseFloat(e.target.value))}
        className="mb-3 w-full accent-lime-500"
      />

      <label className="mb-1 block text-[11px] text-gray-600">
        Rotation: {params.environmentRotation.toFixed(2)}
      </label>
      <input
        type="range"
        min={0}
        max={Math.PI * 2}
        step={0.05}
        value={params.environmentRotation}
        onChange={(e) => set("environmentRotation", parseFloat(e.target.value))}
        className="w-full accent-lime-500"
      />
    </div>
  );
}
