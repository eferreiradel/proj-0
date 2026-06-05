"use client";

import { useConfigStore, type HdriPreset } from "@/modules/viewport/store/useConfigStore";

const PRESETS: HdriPreset[] = ["sunset", "studio", "dawn", "night", "warehouse", "forest", "apartment", "lobby", "city", "park"];

export default function HdriSwitcher() {
  const hdri = useConfigStore((s) => s.hdri);
  const setHdri = useConfigStore((s) => s.setHdri);

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-full bg-white/10 px-2 py-1.5 shadow-lg backdrop-blur-md border border-white/15">
      {PRESETS.map((p) => (
        <button
          key={p}
          onClick={() => setHdri(p)}
          className={`
            rounded-full px-3 py-1 text-xs font-medium
            transition-all duration-150 active:scale-95
            ${hdri === p
              ? "bg-white text-gray-900 shadow-sm"
              : "text-white/60 hover:bg-white/15 hover:text-white"
            }
          `}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
