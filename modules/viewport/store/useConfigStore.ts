import { create } from "zustand";

export const sections = ["esterni", "tetto", "interni", "galley"] as const;
export type Section = (typeof sections)[number];

export type RoofOption = "liscio" | "crossbars" | "roof_rack_full";

interface ConfigState {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  cameraResetCount: number;
  resetCamera: () => void;
  roofOption: RoofOption;
  setRoofOption: (option: RoofOption) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  activeSection: "esterni",
  setActiveSection: (section) => set({ activeSection: section }),
  cameraResetCount: 0,
  resetCamera: () => set((s) => ({ cameraResetCount: s.cameraResetCount + 1 })),
  roofOption: "liscio",
  setRoofOption: (option) => set({ roofOption: option }),
}));
