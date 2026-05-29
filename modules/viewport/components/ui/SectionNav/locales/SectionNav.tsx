"use client";

import { sections, useConfigStore } from "@/modules/viewport/store/useConfigStore";

const labels: Record<string, string> = {
  esterni: "Esterno",
  tetto: "Tetto",
  interni: "Interni",
  galley: "Galley",
};

export default function SectionNav() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const setActiveSection = useConfigStore((s) => s.setActiveSection);
  const resetCamera = useConfigStore((s) => s.resetCamera);

  return (
    <div className="flex items-center gap-1 rounded-full bg-white/95 px-1.5 py-1.5 shadow-lg backdrop-blur-sm">
      {sections.map((section) => {
        const isActive = activeSection === section;
        return (
          <button
            key={section}
            onClick={() => {
              if (isActive) {
                resetCamera();
              } else {
                setActiveSection(section);
              }
            }}
            className={`
              rounded-full px-4 py-1.5 text-sm font-medium
              transition-all duration-150
              active:scale-95
              ${isActive
                ? "bg-gray-900 text-white shadow-inner"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
              }
            `}
          >
            {labels[section]}
          </button>
        );
      })}
    </div>
  );
}
