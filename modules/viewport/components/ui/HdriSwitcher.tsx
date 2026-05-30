"use client";

import { useConfigStore, type HdriPreset } from "@/modules/viewport/store/useConfigStore";

const PRESETS: HdriPreset[] = ["studio", "sunset", "dawn", "night", "warehouse", "forest", "apartment", "lobby"];

export default function HdriSwitcher() {
  const hdri = useConfigStore((s) => s.hdri);
  const setHdri = useConfigStore((s) => s.setHdri);

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-full bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur-sm">
      {PRESETS.map((p) => (
        <button
          key={p}
          onClick={() => setHdri(p)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            hdri === p
              ? "bg-gray-900 text-white"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
