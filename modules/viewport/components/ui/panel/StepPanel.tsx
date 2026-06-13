"use client";

import { useConfigStore, type Section, type PaintColor, type RoofOption } from "@/modules/viewport/store/useConfigStore";
import {
  PAINT_OPTIONS,
  ROOF_OPTIONS,
  OPTIONALS,
  BASE_PRICE,
  formatPrice,
} from "@/modules/viewport/config/configurator";
import {
  SectionLabel,
  OptionGrid,
  ColorRow,
  Toggle,
  CheckList,
  SummaryBox,
} from "./primitives";

export default function StepPanel({ section }: { section: Section }) {
  const paintColor = useConfigStore((s) => s.paintColor);
  const setPaintColor = useConfigStore((s) => s.setPaintColor);
  const roofOption = useConfigStore((s) => s.roofOption);
  const setRoofOption = useConfigStore((s) => s.setRoofOption);
  const optionals = useConfigStore((s) => s.optionals);
  const toggleOptional = useConfigStore((s) => s.toggleOptional);

  // ── Exterior: paint ──────────────────────────────────────────────────────
  if (section === "esterni") {
    const paintLabels = Object.fromEntries(PAINT_OPTIONS.map((p) => [p.id, p.label]));
    const current = PAINT_OPTIONS.find((p) => p.id === paintColor);
    return (
      <div className="flex flex-col gap-4">
        <SectionLabel>Body paint</SectionLabel>
        <ColorRow
          colors={PAINT_OPTIONS.map((p) => p.id)}
          value={paintColor}
          onChange={(c) => setPaintColor(c as PaintColor)}
          labels={paintLabels}
        />
        <p className="text-xs text-gray-500">
          {current?.label}
          {current && current.price > 0 ? ` · +${formatPrice(current.price)}` : " · included"}
        </p>
      </div>
    );
  }

  // ── Roof ──────────────────────────────────────────────────────────────────
  if (section === "tetto") {
    return (
      <div className="flex flex-col gap-4">
        <SectionLabel>Roof configuration</SectionLabel>
        <OptionGrid
          cols={1}
          value={roofOption}
          onChange={(id) => setRoofOption(id as RoofOption)}
          options={ROOF_OPTIONS.map((r) => ({
            id: r.id,
            label: r.label,
            sub: r.price > 0 ? `${r.sub} · +${formatPrice(r.price)}` : `${r.sub} · included`,
          }))}
        />
      </div>
    );
  }

  // ── Interior: work in progress ──────────────────────────────────────────────
  if (section === "interni") {
    return (
      <div className="flex flex-col gap-4">
        <SectionLabel>Interior</SectionLabel>
        <div className="rounded-[10px] border-[0.5px] border-black/10 bg-gray-50 px-3.5 py-6 text-center">
          <p className="text-[13px] font-medium text-gray-900">Work in progress</p>
          <p className="mt-1 text-[11px] text-gray-400">
            Interior options are still being configured.
          </p>
        </div>
      </div>
    );
  }

  // ── Galley: work in progress ────────────────────────────────────────────────
  if (section === "galley") {
    return (
      <div className="flex flex-col gap-4">
        <SectionLabel>Galley</SectionLabel>
        <div className="rounded-[10px] border-[0.5px] border-black/10 bg-gray-50 px-3.5 py-6 text-center">
          <p className="text-[13px] font-medium text-gray-900">Coming soon</p>
          <p className="mt-1 text-[11px] text-gray-400">
            The galley configurator is still in progress.
          </p>
        </div>
      </div>
    );
  }

  // ── Checkout: summary + quote request ────────────────────────────────────────
  if (section === "checkout") {
    const paint = PAINT_OPTIONS.find((p) => p.id === paintColor);
    const roof = ROOF_OPTIONS.find((r) => r.id === roofOption);
    const chosenOptionals = OPTIONALS.filter((o) => optionals.includes(o.id));

    const rows = [
      { key: "Base model", val: formatPrice(BASE_PRICE) },
      { key: `Paint · ${paint?.label}`, val: paint && paint.price > 0 ? `+${formatPrice(paint.price)}` : "incl." },
      { key: `Roof · ${roof?.label}`, val: roof && roof.price > 0 ? `+${formatPrice(roof.price)}` : "incl." },
      ...chosenOptionals.map((o) => ({ key: o.label, val: `+${formatPrice(o.price)}` })),
    ];

    const total =
      BASE_PRICE +
      (paint?.price ?? 0) +
      (roof?.price ?? 0) +
      chosenOptionals.reduce((sum, o) => sum + o.price, 0);

    return (
      <div className="flex flex-col gap-4">
        <SectionLabel>Your build</SectionLabel>
        <SummaryBox rows={rows} total={total} />

        <SectionLabel>Request a quote</SectionLabel>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Full name"
            className="rounded-[10px] border-[0.5px] border-black/10 bg-white px-3 py-2.5 text-[13px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-lime-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="rounded-[10px] border-[0.5px] border-black/10 bg-white px-3 py-2.5 text-[13px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-lime-500"
          />
        </div>
      </div>
    );
  }

  return null;
}
