"use client";

import { Check } from "lucide-react";
import { formatPrice } from "@/modules/viewport/config/configurator";

// ── SectionLabel ──────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400">
      {children}
    </p>
  );
}

// ── OptionGrid ──────────────────────────────────────────────────────────────
export interface Option {
  id: string;
  label: string;
  sub?: string;
  color?: string;
}

export function OptionGrid({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  cols?: number;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`rounded-[10px] px-3 py-2.5 text-left transition-colors ${
              selected
                ? "border-[1.5px] border-lime-500 bg-white"
                : "border-[0.5px] border-black/10 bg-gray-50 hover:border-black/20 hover:bg-gray-100"
            }`}
          >
            {opt.color && (
              <div
                className="mb-1.5 h-[22px] w-full rounded border-[0.5px] border-black/10"
                style={{ backgroundColor: opt.color }}
              />
            )}
            <div className="text-xs font-medium text-gray-900">{opt.label}</div>
            {opt.sub && <div className="mt-0.5 text-[11px] text-gray-400">{opt.sub}</div>}
          </button>
        );
      })}
    </div>
  );
}

// ── ColorRow ──────────────────────────────────────────────────────────────
export function ColorRow({
  colors,
  value,
  onChange,
  labels,
}: {
  colors: string[];
  value: string;
  onChange: (c: string) => void;
  labels?: Record<string, string>;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {colors.map((c) => {
        const selected = value === c;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            aria-label={labels?.[c] ?? c}
            title={labels?.[c] ?? c}
            className={`h-[30px] w-[30px] rounded-full transition-transform ${
              selected ? "scale-110 outline outline-2 outline-offset-[3px] outline-lime-500" : ""
            }`}
            style={{ backgroundColor: c }}
          />
        );
      })}
    </div>
  );
}

// ── Toggle ──────────────────────────────────────────────────────────────────
export function Toggle({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-[10px] border-[0.5px] border-black/10 px-3.5 py-2.5">
      <span className="text-[13px] text-gray-900">{label}</span>
      <button
        onClick={() => onChange(!value)}
        disabled={disabled}
        aria-label={label}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        } ${value ? "bg-lime-500" : "bg-black/20"}`}
      >
        <span
          className={`absolute top-[3px] h-3.5 w-3.5 rounded-full bg-white transition-transform ${
            value ? "translate-x-[19px]" : "translate-x-[3px]"
          }`}
        />
      </button>
    </div>
  );
}

// ── CheckList ───────────────────────────────────────────────────────────────
export interface CheckItem {
  id: string;
  label: string;
  sub: string;
  price: number;
}

export function CheckList({
  items,
  selected,
  onToggle,
}: {
  items: CheckItem[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item) => {
        const on = selected.includes(item.id);
        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-left transition-colors ${
              on ? "border-[1.5px] border-lime-500" : "border-[0.5px] border-black/10 hover:border-black/20"
            }`}
          >
            <div
              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded ${
                on ? "bg-lime-500" : "border-[0.5px] border-black/20"
              }`}
            >
              {on && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-gray-900">{item.label}</div>
              <div className="text-[11px] text-gray-400">{item.sub}</div>
            </div>
            <div className="shrink-0 text-xs text-gray-500">+{formatPrice(item.price)}</div>
          </button>
        );
      })}
    </div>
  );
}

// ── SummaryBox ──────────────────────────────────────────────────────────────
export function SummaryBox({
  rows,
  total,
}: {
  rows: { key: string; val: string }[];
  total: number;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-[10px] border-[0.5px] border-black/10 px-3.5 py-3">
      {rows.map((r, i) => (
        <div key={i} className="flex justify-between text-xs">
          <span className="text-gray-400">{r.key}</span>
          <span className="text-gray-900">{r.val}</span>
        </div>
      ))}
      <div className="mt-0.5 flex justify-between border-t-[0.5px] border-black/10 pt-2 text-[13px] font-semibold text-gray-900">
        <span>Estimated total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
