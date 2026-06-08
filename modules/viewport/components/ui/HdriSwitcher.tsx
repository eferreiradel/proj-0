"use client";

import { useConfigStore, type HdriPreset } from "@/modules/viewport/store/useConfigStore";

const PRESETS: HdriPreset[] = ["sunset", "studio", "dawn", "night", "warehouse", "forest", "apartment", "lobby", "city", "park"];

export default function HdriSwitcher() {
  const hdri = useConfigStore((s) => s.hdri);
  const setHdri = useConfigStore((s) => s.setHdri);

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-2xl bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur-sm border border-black/5">
      {PRESETS.map((p) => (
        <button
          key={p}
          onClick={() => setHdri(p)}
          className={`
            rounded-full px-3 py-1 text-xs font-medium capitalize
            transition-all duration-150 active:scale-95
            ${hdri === p
              ? "bg-lime-400 text-gray-900 shadow-sm"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }
          `}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
