"use client";

import { PAINT_COLORS, useConfigStore } from "@/modules/viewport/store/useConfigStore";

const colorNames: Record<string, string> = {
  "#e63946": "Racing Red",
  "#457b9d": "Ocean Blue",
  "#f4a261": "Sahara Orange",
  "#2a9d8f": "Mint Green",
  "#f1faee": "Pearl White",
};

export default function ColorPicker() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const paintColor = useConfigStore((s) => s.paintColor);
  const setPaintColor = useConfigStore((s) => s.setPaintColor);

  if (activeSection !== "esterni") return null;

  return (
    <div className="flex items-center gap-2 px-1">
      {PAINT_COLORS.map((color) => {
        const isActive = paintColor === color;
        return (
          <button
            key={color}
            onClick={() => setPaintColor(color)}
            aria-label={colorNames[color] ?? color}
            title={colorNames[color] ?? color}
            className={`
              relative h-7 w-7 rounded-full border-2 transition-all duration-150 hover:scale-110 active:scale-95
              ${isActive
                ? "border-white ring-2 ring-white ring-offset-2 ring-offset-transparent"
                : "border-white/30 hover:border-white/60"
              }
            `}
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}
