"use client";

import { useConfigStore } from "@/modules/viewport/store/useConfigStore";

const options = [
  { id: "liscio", label: "Liscio", description: "Profilo aerodinamico stan..." },
  { id: "crossbars", label: "Crossbars", description: "Barre trasversali in allu..." },
  { id: "roof_rack_full", label: "Roof Rack Full", description: "Portapacchi completo per il tetto..." },
] as const;

type RoofOption = (typeof options)[number]["id"];

export default function RoofOptions() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const roofOption = useConfigStore((s) => s.roofOption);
  const setRoofOption = useConfigStore((s) => s.setRoofOption);

  if (activeSection !== "tetto") return null;

  return (
    <div className="w-64 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm font-semibold text-gray-900">Configurazione</span>
        </div>
        <span className="text-xs text-gray-400">
          {options.findIndex((o) => o.id === roofOption) + 1} / {options.length}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setRoofOption(option.id)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
              roofOption === option.id
                ? "bg-gray-100 ring-1 ring-gray-300"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <div className="h-5 w-5 rounded bg-gray-200" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{option.label}</p>
              <p className="text-xs text-gray-500 truncate">{option.description}</p>
            </div>
            <div
              className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                roofOption === option.id ? "border-gray-900" : "border-gray-300"
              }`}
            >
              {roofOption === option.id && (
                <div className="h-2 w-2 rounded-full bg-gray-900" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
