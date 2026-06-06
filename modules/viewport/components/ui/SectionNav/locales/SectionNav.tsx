"use client";

import { sections, useConfigStore } from "@/modules/viewport/store/useConfigStore";

const labels: Record<string, string> = {
  esterni: "Exterior",
  tetto: "Roof",
  interni: "Interior",
  galley: "Galley",
};

export default function SectionNav() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const setActiveSection = useConfigStore((s) => s.setActiveSection);
  const resetCamera = useConfigStore((s) => s.resetCamera);

  return (
    <div className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-1.5 shadow-lg backdrop-blur-md border border-white/15">
      {sections.map((section) => {
        const isActive = activeSection === section;
        return (
          <button
            key={section}
            onClick={() => isActive ? resetCamera() : setActiveSection(section)}
            className={`
              rounded-full px-4 py-1.5 text-sm font-medium
              transition-all duration-150 active:scale-95
              ${isActive
                ? "bg-white text-gray-900 shadow-sm"
                : "text-white/70 hover:bg-white/15 hover:text-white active:bg-white/20"
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
