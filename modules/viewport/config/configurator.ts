import type { Section, RoofOption, PaintColor } from "@/modules/viewport/store/useConfigStore";

// ── Steps (mapped 1:1 to the 3D camera sections) ──────────────────────────
export interface StepDef {
  id: Section;
  label: string;
  title: string;
  description: string;
}

export const STEPS: StepDef[] = [
  { id: "esterni", label: "Exterior", title: "Exterior", description: "Choose the body paint finish." },
  { id: "tetto",   label: "Roof",     title: "Roof",     description: "Pick your roof configuration." },
  { id: "interni", label: "Interior", title: "Interior", description: "Set the cabin ambient & extras." },
  { id: "galley",  label: "Galley",   title: "Galley",   description: "Galley configuration — coming soon." },
  { id: "checkout", label: "Checkout", title: "Checkout", description: "Review your build and request a quote." },
];

// ── Pricing ───────────────────────────────────────────────────────────────
export const BASE_PRICE = 18900;

export const PAINT_OPTIONS: { id: PaintColor; label: string; price: number }[] = [
  { id: "#f1faee", label: "Pearl White",    price: 0 },
  { id: "#e63946", label: "Racing Red",     price: 450 },
  { id: "#457b9d", label: "Ocean Blue",     price: 450 },
  { id: "#f4a261", label: "Sahara Orange",  price: 450 },
  { id: "#2a9d8f", label: "Mint Green",     price: 450 },
];

export const ROOF_OPTIONS: { id: RoofOption; label: string; sub: string; price: number }[] = [
  { id: "liscio",         label: "Smooth",        sub: "Standard aerodynamic profile", price: 0 },
  { id: "crossbars",      label: "Crossbars",     sub: "Aluminium crossbars",          price: 350 },
  { id: "roof_rack_full", label: "Roof Rack Full", sub: "Full-length roof rack",       price: 890 },
];

export interface OptionalDef {
  id: string;
  label: string;
  sub: string;
  price: number;
}

export const OPTIONALS: OptionalDef[] = [
  { id: "solar",      label: "Solar package",    sub: "200W roof panel + controller", price: 1200 },
  { id: "heater",     label: "Diesel heater",    sub: "2kW cabin heating",            price: 780 },
  { id: "fridge",     label: "Compressor fridge", sub: "40L 12V",                     price: 540 },
  { id: "awning",     label: "Side awning",      sub: "2.5m pull-out",                price: 420 },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
export const formatPrice = (n: number) =>
  "€ " + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

// ── Live total from a config snapshot ──────────────────────────────────────
export function computeTotal(opts: {
  paintColor: string;
  roofOption: string;
  optionals: string[];
}): number {
  const paint = PAINT_OPTIONS.find((p) => p.id === opts.paintColor);
  const roof = ROOF_OPTIONS.find((r) => r.id === opts.roofOption);
  const optionalsTotal = OPTIONALS.filter((o) => opts.optionals.includes(o.id)).reduce(
    (sum, o) => sum + o.price,
    0,
  );
  return BASE_PRICE + (paint?.price ?? 0) + (roof?.price ?? 0) + optionalsTotal;
}
