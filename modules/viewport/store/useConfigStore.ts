import { create } from "zustand";

export const sections = ["esterni", "tetto", "interni", "galley", "freeview"] as const;
export type Section = (typeof sections)[number];

export type RoofOption = "liscio" | "crossbars";

interface ConfigState {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  roofOption: RoofOption;
  setRoofOption: (option: RoofOption) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  activeSection: "esterni",
  setActiveSection: (section) => set({ activeSection: section }),
  roofOption: "liscio",
  setRoofOption: (option) => set({ roofOption: option }),
}));
