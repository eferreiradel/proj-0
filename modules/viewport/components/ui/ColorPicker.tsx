"use client";

import { PAINT_COLORS, useConfigStore } from "@/modules/viewport/store/useConfigStore";

const colorNames: Record<string, string> = {
  "#e63946": "Rosso Corsa",
  "#457b9d": "Blu Oceano",
  "#f4a261": "Arancio Sahara",
  "#2a9d8f": "Verde Menta",
  "#f1faee": "Bianco Perla",
};

export default function ColorPicker() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const paintColor = useConfigStore((s) => s.paintColor);
  const setPaintColor = useConfigStore((s) => s.setPaintColor);

  if (activeSection !== "esterni") return null;

  return (
    <div className="w-64 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm font-semibold text-gray-900">Colore</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {PAINT_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setPaintColor(color)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
              paintColor === color
                ? "bg-gray-100 ring-1 ring-gray-300"
                : "hover:bg-gray-50"
            }`}
          >
            <div
              className="h-7 w-7 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-medium text-gray-900">
              {colorNames[color] ?? color}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
