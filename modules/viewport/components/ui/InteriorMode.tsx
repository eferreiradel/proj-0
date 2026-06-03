"use client";

import { useConfigStore } from "@/modules/viewport/store/useConfigStore";
import { Sun, Moon } from "lucide-react";

export default function InteriorModeSwitch() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const interiorMode = useConfigStore((s) => s.interiorMode);
  const setInteriorMode = useConfigStore((s) => s.setInteriorMode);

  if (activeSection !== "interni") return null;

  const isNight = interiorMode === "night";

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/95 px-2 py-2 shadow-lg backdrop-blur-sm">
      {/* Custom switch with icons inside thumb */}
      <button
        onClick={() => setInteriorMode(isNight ? "day" : "night")}
        aria-label={isNight ? "Switch to day" : "Switch to night"}
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
    </div>
  );
}
