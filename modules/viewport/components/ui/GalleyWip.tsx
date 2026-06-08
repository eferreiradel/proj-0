"use client";

import { useConfigStore } from "@/modules/viewport/store/useConfigStore";
import { Wrench } from "lucide-react";

export default function GalleyWip() {
  const activeSection = useConfigStore((s) => s.activeSection);

  if (activeSection !== "galley") return null;

  return (
    <div className="flex items-center gap-2 px-2 text-gray-500">
      <Wrench className="h-4 w-4" />
      <span className="text-sm font-medium">Work in progress</span>
    </div>
  );
}
