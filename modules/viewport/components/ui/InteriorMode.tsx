"use client";

import { useConfigStore, type InteriorMode } from "@/modules/viewport/store/useConfigStore";

const modes: { id: InteriorMode; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "night", label: "Night" },
];

export default function InteriorModeSwitch({ mobile = false }: { mobile?: boolean }) {
  const activeSection = useConfigStore((s) => s.activeSection);
  const interiorMode = useConfigStore((s) => s.interiorMode);
  const setInteriorMode = useConfigStore((s) => s.setInteriorMode);

  if (activeSection !== "interni") return null;

  return (
    <div className={mobile
      ? "w-full rounded-t-2xl bg-white/95 p-4 shadow-lg backdrop-blur-sm"
      : "w-64 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-sm"
    }>
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-sm font-semibold text-gray-900">Ambient</span>
      </div>

      <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
        {modes.map((mode) => {
          const isActive = interiorMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setInteriorMode(mode.id)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-gray-900 text-white shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
