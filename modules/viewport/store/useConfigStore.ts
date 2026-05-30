import { create } from "zustand";

export const sections = ["esterni", "tetto", "interni", "galley"] as const;
export type Section = (typeof sections)[number];

export type RoofOption = "liscio" | "crossbars" | "roof_rack_full";
export type HdriPreset = "studio" | "sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "lobby";

export const PAINT_COLORS = ["#f1faee", "#e63946", "#457b9d", "#f4a261", "#2a9d8f"] as const;
export type PaintColor = (typeof PAINT_COLORS)[number];

interface ConfigState {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  cameraResetCount: number;
  resetCamera: () => void;
  roofOption: RoofOption;
  setRoofOption: (option: RoofOption) => void;
  hdri: HdriPreset;
  setHdri: (preset: HdriPreset) => void;
  paintColor: PaintColor;
  setPaintColor: (color: PaintColor) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  activeSection: "esterni",
  setActiveSection: (section) => set({ activeSection: section }),
  cameraResetCount: 0,
  resetCamera: () => set((s) => ({ cameraResetCount: s.cameraResetCount + 1 })),
  roofOption: "liscio",
  setRoofOption: (option) => set({ roofOption: option }),
  hdri: "lobby",
  setHdri: (preset) => set({ hdri: preset }),
  paintColor: "#f1faee",
  setPaintColor: (color) => set({ paintColor: color }),
}));
