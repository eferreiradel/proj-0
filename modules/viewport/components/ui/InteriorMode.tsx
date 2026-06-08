"use client";

import { useConfigStore } from "@/modules/viewport/store/useConfigStore";
import { Sun, Moon, Loader2 } from "lucide-react";

export default function InteriorModeSwitch() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const interiorMode = useConfigStore((s) => s.interiorMode);
  const setInteriorMode = useConfigStore((s) => s.setInteriorMode);
  const lightmapsReady = useConfigStore((s) => s.lightmapsReady);

  if (activeSection !== "interni") return null;

  const isNight = interiorMode === "night";

  return (
    <div className="flex items-center gap-3 px-1">
      <span className="text-sm font-medium text-gray-600">
        {isNight ? "Night" : "Day"}
      </span>
      <button
        onClick={() => setInteriorMode(isNight ? "day" : "night")}
        disabled={!lightmapsReady}
        aria-label={isNight ? "Switch to day" : "Switch to night"}
        className={`
          relative inline-flex h-8 w-16 items-center rounded-full
          transition-colors duration-300 focus:outline-none
          ${!lightmapsReady ? "cursor-not-allowed opacity-50" : ""}
          ${isNight ? "bg-lime-400" : "bg-gray-200"}
          border border-black/5
        `}
      >
        <Sun  className="absolute left-1.5 h-4 w-4 text-gray-500" />
        <Moon className="absolute right-1.5 h-4 w-4 text-gray-700" />

        <span
          className={`
            relative z-10 flex h-6 w-6 items-center justify-center
            rounded-full bg-white shadow-md
            transition-transform duration-300
            ${isNight ? "translate-x-9" : "translate-x-1"}
          `}
        >
          {!lightmapsReady
            ? <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-900" />
            : isNight
              ? <Moon className="h-3.5 w-3.5 text-gray-900" />
              : <Sun  className="h-3.5 w-3.5 text-gray-900" />
          }
        </span>
      </button>
    </div>
  );
}
