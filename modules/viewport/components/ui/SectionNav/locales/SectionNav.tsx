"use client";

import {
  sections,
  useConfigStore,
} from "@/modules/viewport/store/useConfigStore";

const labels: Record<string, string> = {
  esterni: "Esterno",
  tetto: "Tetto",
  interni: "Interni",
  galley: "Galley",
  freeview: "Free View",
};

export default function SectionNav() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const setActiveSection = useConfigStore((s) => s.setActiveSection);

  return (
    <div className="flex items-center gap-1 rounded-full bg-white/95 px-1.5 py-1.5 shadow-lg backdrop-blur-sm">
      {sections.map((section, i) => {
        const isDisabled = section === "freeview" && activeSection === "interni";
        return (
          <button
            key={section}
            onClick={() => !isDisabled && setActiveSection(section)}
            disabled={isDisabled}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeSection === section
                ? "bg-gray-900 text-white"
                : isDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {labels[section]}
          </button>
        );
      })}
    </div>
  );
}
