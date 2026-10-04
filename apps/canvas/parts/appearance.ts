import type { ColorToken, Item, Radii, TextToken } from "../lib/tokens";
import { mapNodes, type PNode } from "./node";

/* A part's look, set beside its props: the fill role it paints itself with, the role its text
 * reads in, and its four corner radii. They live on the item (like a legacy part's own fill and
 * corners) and are painted onto the part's tree as a fixed class map plus `style.borderRadius`,
 * so the canvas drawing and the printed code carry the same appearance. */

export type Appearance = { fill?: ColorToken; text?: TextToken; corners?: Radii };

/** the palette role a fill paints with, and the on-role its text takes over it */
const FILL_CLASS: Record<ColorToken, [bg: string, on: string]> = {
  surface: ["bg-surface", "text-on-surface"],
  surfaceContainerLow: ["bg-surface-container-low", "text-on-surface"],
  surfaceContainer: ["bg-surface-container", "text-on-surface"],
  surfaceContainerHigh: ["bg-surface-container-high", "text-on-surface"],
  surfaceContainerHighest: ["bg-surface-container-highest", "text-on-surface"],
  primaryContainer: ["bg-primary-container", "text-on-primary-container"],
  secondaryContainer: ["bg-secondary-container", "text-on-secondary-container"],
  tertiaryContainer: ["bg-tertiary-container", "text-on-tertiary-container"],
  primary: ["bg-primary", "text-on-primary"],
  inverseSurface: ["bg-inverse-surface", "text-inverse-on-surface"],
};

const TEXT_CLASS: Record<TextToken, string> = {
  onSurface: "text-on-surface",
  onSurfaceVariant: "text-on-surface-variant",
  primary: "text-primary",
  secondary: "text-secondary",
  onPrimaryContainer: "text-on-primary-container",
  onSecondaryContainer: "text-on-secondary-container",
  onTertiaryContainer: "text-on-tertiary-container",
  inverseOnSurface: "text-inverse-on-surface",
};

/** the colour classes an appearance replaces on its target (its own palette classes stay) */
const STRIP = new Set([...Object.values(FILL_CLASS).flat(), ...Object.values(TEXT_CLASS)]);

/** the look an item carries, or nothing when the part keeps its own */
export function appearanceOf(it: Pick<Item, "fill" | "textColor" | "corners">): Appearance | undefined {
  return it.fill || it.textColor || it.corners ? { fill: it.fill, text: it.textColor, corners: it.corners } : undefined;
}

const radiusOf = (c: Radii) => `${c.tl}px ${c.tr}px ${c.br}px ${c.bl}px`;

/** paint `a` onto the nodes of `tree` whose type is `target` — the root when no target is named */
export function applyAppearance(tree: PNode, a: Appearance | undefined, target?: string | string[]): PNode {
  if (!a) return tree;
  const classes = [a.fill ? FILL_CLASS[a.fill][0] : undefined, a.text ? TEXT_CLASS[a.text] : a.fill ? FILL_CLASS[a.fill][1] : undefined]
    .filter((c): c is string => !!c)
    .join(" ");
  const paint = (n: PNode): PNode => {
    const props = { ...(n.props ?? {}) };
    if (classes) {
      const kept = (typeof props.className === "string" ? props.className.split(/\s+/) : []).filter((c) => c && !STRIP.has(c));
      props.className = [...kept, ...classes.split(" ")].join(" ");
    }
    if (a.corners) props.style = { ...(typeof props.style === "object" && props.style !== null ? props.style : {}), borderRadius: radiusOf(a.corners) };
    return { ...n, props };
  };
  const targets = target === undefined ? [] : Array.isArray(target) ? target : [target];
  return targets.length ? mapNodes(tree, (n) => (targets.includes(n.type) ? paint(n) : n)) : paint(tree);
}
