"use client";

import { useConfigStore } from "@/modules/viewport/store/useConfigStore";
import { Sun, Moon } from "lucide-react";

export default function InteriorModeSwitch({ mobile = false }: { mobile?: boolean }) {
  const activeSection = useConfigStore((s) => s.activeSection);
  const interiorMode = useConfigStore((s) => s.interiorMode);
  const setInteriorMode = useConfigStore((s) => s.setInteriorMode);

  if (activeSection !== "interni") return null;

  const isNight = interiorMode === "night";

  return (
    <div className={mobile
      ? "w-full rounded-t-2xl bg-white/95 p-4 shadow-lg backdrop-blur-sm"
      : "w-64 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-sm"
    }>
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-sm font-semibold text-gray-900">Ambient</span>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium text-gray-500">Day</span>

        {/* Custom switch with icons inside thumb */}
        <button
          onClick={() => setInteriorMode(isNight ? "day" : "night")}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none ${
            isNight ? "bg-gray-900" : "bg-gray-200"
          }`}
        >
          {/* Track icons */}
          <Sun className={`absolute left-1.5 h-4 w-4 opacity-60 ${isNight ? "text-white" : "text-gray-900"}`} />
          <Moon className={`absolute right-1.5 h-4 w-4 opacity-60 ${isNight ? "text-white" : "text-gray-900"}`} />

          {/* Thumb with active icon */}
          <span
            className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${
              isNight ? "translate-x-9" : "translate-x-1"
            }`}
          >
            {isNight
              ? <Moon className="h-3.5 w-3.5 text-gray-900" />
              : <Sun className="h-3.5 w-3.5 text-gray-900" />
            }
          </span>
        </button>

        <span className="text-sm font-medium text-gray-500">Night</span>
      </div>
    </div>
  );
}
