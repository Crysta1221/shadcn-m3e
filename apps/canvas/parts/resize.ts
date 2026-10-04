import { reader } from "./registry";
import type { Choice, PartDef, PropDef, PropValues } from "./types";

/* Which of a part's props the canvas handles pull on. They are derived from the prop
 * definitions themselves: a number prop named `width` / `height` is that measure, and a part
 * with only a `size` (an avatar, a spinner — or a button's named XS–XL) is held by the points
 * around it. A prop hidden by its `when` is no measure either: a basic dialog's sizes are the
 * full-screen one's, so a basic dialog has nothing to pull and is only moved. */

type NumberDef = Extract<PropDef, { kind: "number" }>;

/** one measure a handle pulls: a number prop dragged to any value in its bounds, or an enum
 *  `size` whose options carry their dp in the label ("XS · 32") snapped between */
export type PartAxis =
  | ({ kind: "number" } & Pick<NumberDef, "key" | "min" | "max" | "step" | "default">)
  | { kind: "enum"; key: string; min: number; max: number; /** the dp each option stands for */ dps: number[]; values: string[]; default: string };

export type ResizeAxes = { width?: PartAxis; height?: PartAxis; size?: PartAxis };

/** the dp figure an enum option stands for, out of its label ("XS · 32") or a numeric value */
export const dpOf = (o: Choice): number | undefined => {
  const m = (typeof o === "string" ? o : o.label).match(/(\d+)/);
  return m ? +m[1] : undefined;
};

const axisOf = (d: PropDef): PartAxis | undefined => {
  if (d.kind === "number") return { kind: "number", key: d.key, min: d.min, max: d.max, step: d.step, default: d.default };
  if (d.kind === "enum" && d.key === "size" && d.options.length > 1) {
    const dps = d.options.map(dpOf);
    if (dps.every((v): v is number => v !== undefined))
      return { kind: "enum", key: d.key, min: Math.min(...(dps as number[])), max: Math.max(...(dps as number[])), dps: dps as number[], values: d.options.map((o) => (typeof o === "string" ? o : o.value)), default: d.default };
  }
  return undefined;
};

/** the props a handle can write, or null when the part has no measure of its own to pull on */
export function resizeOf(def: PartDef | undefined, values?: PropValues): ResizeAxes | null {
  if (!def) return null;
  const p = reader(def, values);
  const axisFor = (key: string) => {
    const d = def.props.find((x) => x.key === key && (!x.when || x.when(p)));
    return d ? axisOf(d) : undefined;
  };
  const width = axisFor("width");
  const height = axisFor("height");
  if (width || height) return { width, height };
  const size = axisFor("size");
  return size ? { size } : null;
}

/** the current measure of an axis: the author's value, kept inside its bounds, or its default */
export function axisValue(a: PartAxis, values: PropValues | undefined): number {
  const v = values?.[a.key];
  if (a.kind === "number") return typeof v === "number" && Number.isFinite(v) ? Math.min(a.max, Math.max(a.min, v)) : a.default;
  const i = a.values.indexOf(typeof v === "string" ? v : a.default);
  return a.dps[i >= 0 ? i : 0];
}

/** the prop value a new measure on an axis is: snapped to a named size for an enum */
export function axisWrite(a: PartAxis, v: number): number | string {
  if (a.kind === "number") return Math.min(a.max, Math.max(a.min, v));
  const i = a.dps.reduce((best, dp, j) => (Math.abs(dp - v) < Math.abs(a.dps[best] - v) ? j : best), 0);
  return a.values[i];
}

/** one keyboard nudge on an axis: the next number step, or the next named size; undefined at the end */
export function axisStep(a: PartAxis, values: PropValues | undefined, dir: 1 | -1): number | string | undefined {
  if (a.kind === "number") {
    const cur = axisValue(a, values);
    const v = Math.min(a.max, Math.max(a.min, Math.round(cur / 4) * 4 + dir * 4));
    return v === cur ? undefined : v;
  }
  const cur = axisValue(a, values);
  const i = a.dps.reduce((best, dp, j) => (Math.abs(dp - cur) < Math.abs(a.dps[best] - cur) ? j : best), 0) + dir;
  return i < 0 || i >= a.values.length ? undefined : a.values[i];
}

/** the current value of a number prop: the author's, kept inside the prop's bounds, or its default */
export function numberValue(d: NumberDef, values: PropValues | undefined): number {
  const v = values?.[d.key];
  return typeof v === "number" && Number.isFinite(v) ? Math.min(d.max, Math.max(d.min, v)) : d.default;
}

/** the first single-line text a part shows: what the layers and the prompt call it instead of its type */
export function labelOfPart(def: PartDef | undefined, values: PropValues | undefined): string {
  if (!def) return "";
  for (const d of def.props) {
    if (d.kind !== "text" || d.multiline) continue;
    const v = values?.[d.key];
    const text = (typeof v === "string" ? v : d.default).trim();
    if (text) return text.length > 24 ? `${text.slice(0, 23)}…` : text;
  }
  return "";
}

/** the corner-anchored FAB: it grows out of the corner of the screen it sits in */
export const isFabPart = (slug: string | undefined) => slug === "fab" || slug === "fab-menu";
