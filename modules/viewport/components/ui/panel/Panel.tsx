"use client";

import { useConfigStore } from "@/modules/viewport/store/useConfigStore";
import { STEPS } from "@/modules/viewport/config/configurator";
import StepPanel from "./StepPanel";

export default function Panel() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const setActiveSection = useConfigStore((s) => s.setActiveSection);

  const activeIndex = STEPS.findIndex((s) => s.id === activeSection);
  const step = STEPS[activeIndex];
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex >= STEPS.length - 1;

  return (
    <aside className="flex w-[300px] flex-shrink-0 flex-col overflow-hidden border-r-[0.5px] border-black/10 bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b-[0.5px] border-black/10 px-5 pb-3.5 pt-5">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">{step?.title}</h2>
        <p className="mt-0.5 text-xs text-gray-400">{step?.description}</p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-[18px] [scrollbar-width:thin]">
        <StepPanel section={activeSection} />
      </div>

      {/* Footer */}
      <div className="flex flex-shrink-0 gap-2.5 border-t-[0.5px] border-black/10 px-5 py-3.5">
        <button
          disabled={isFirst}
          onClick={() => !isFirst && setActiveSection(STEPS[activeIndex - 1].id)}
          className="flex-1 rounded-[10px] border-[0.5px] border-black/10 bg-transparent py-2.5 text-[13px] text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-default disabled:opacity-30"
        >
          Back
        </button>
        <button
          disabled={isLast}
          onClick={() => !isLast && setActiveSection(STEPS[activeIndex + 1].id)}
          className="flex-[2] rounded-[10px] bg-lime-500 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-default disabled:opacity-40"
        >
          {isLast ? "Request quote" : "Next"}
        </button>
      </div>
    </aside>
  );
}
