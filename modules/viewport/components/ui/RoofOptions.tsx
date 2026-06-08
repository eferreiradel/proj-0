"use client";

import { useConfigStore } from "@/modules/viewport/store/useConfigStore";

const options = [
  { id: "liscio",         label: "Smooth",         description: "Standard aerodynamic profile" },
  { id: "crossbars",      label: "Crossbars",       description: "Aluminium crossbars" },
  { id: "roof_rack_full", label: "Roof Rack Full",  description: "Full roof rack" },
] as const;

export default function RoofOptions() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const roofOption = useConfigStore((s) => s.roofOption);
  const setRoofOption = useConfigStore((s) => s.setRoofOption);

  if (activeSection !== "tetto") return null;

  return (
    <div className="flex items-center gap-1 px-1">
      {options.map((option) => {
        const isActive = roofOption === option.id;
        return (
          <button
            key={option.id}
            onClick={() => setRoofOption(option.id)}
            title={option.description}
            className={`
              whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium
              transition-all duration-150 active:scale-95
              ${isActive
                ? "bg-lime-400 text-gray-900 shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
