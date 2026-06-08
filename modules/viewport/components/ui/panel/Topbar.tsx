"use client";

import { Check } from "lucide-react";
import { useConfigStore } from "@/modules/viewport/store/useConfigStore";
import { STEPS, computeTotal, formatPrice } from "@/modules/viewport/config/configurator";

export default function Topbar() {
  const activeSection = useConfigStore((s) => s.activeSection);
  const setActiveSection = useConfigStore((s) => s.setActiveSection);
  const paintColor = useConfigStore((s) => s.paintColor);
  const roofOption = useConfigStore((s) => s.roofOption);
  const optionals = useConfigStore((s) => s.optionals);

  const activeIndex = STEPS.findIndex((s) => s.id === activeSection);
  const total = computeTotal({ paintColor, roofOption, optionals });

  return (
    <div className="flex h-[52px] flex-shrink-0 items-center gap-4 border-b-[0.5px] border-black/10 bg-white px-5">
      {/* Logo */}
      <div className="flex flex-shrink-0 items-center gap-2.5">
        <div className="h-4 w-[26px] bg-lime-500" style={{ borderRadius: "3px 10px 3px 3px" }} />
        <span className="text-sm font-semibold tracking-tight text-gray-900">Teardrop</span>
      </div>

      {/* Stepbar */}
      <div className="flex flex-1 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STEPS.map((step, i) => {
          const isActive = i === activeIndex;
          const isDone = i < activeIndex;
          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setActiveSection(step.id)}
                className="flex flex-shrink-0 items-center gap-2 rounded-lg px-2.5 py-1 transition-colors hover:bg-black/[0.04]"
              >
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] transition-colors ${
                    isDone
                      ? "bg-lime-500 text-white"
                      : isActive
                        ? "border-2 border-lime-400 text-gray-900"
                        : "border border-black/20 text-gray-400"
                  }`}
                >
                  {isDone ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={`whitespace-nowrap text-xs ${
                    isActive ? "font-medium text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && <span className="h-px w-[18px] flex-shrink-0 bg-black/10" />}
            </div>
          );
        })}
      </div>

      {/* Price chip */}
      <div className="flex flex-shrink-0 items-baseline gap-1.5 rounded-full border-[0.5px] border-black/10 px-3.5 py-1.5">
        <span className="text-[11px] text-gray-400">Estimate</span>
        <span className="text-sm font-semibold text-gray-900">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
