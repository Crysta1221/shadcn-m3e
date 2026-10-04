import { h } from "../node";
import type { PartDef } from "../types";

const BASELINE_SEED = "#6750A4";

const VARIANTS = ["baseline", "tonalSpot", "expressive", "vibrant", "neutral", "fidelity", "content", "rainbow", "fruitSalad", "monochrome"];

const SWATCHES = ["bg-primary", "bg-secondary", "bg-tertiary", "bg-primary-container", "bg-surface-container-highest"];

export const theming: PartDef[] = [
  {
    slug: "theme-provider",
    name: "Theme provider",
    category: "Theming",
    icon: "palette",
    w: 320,
    h: 200,
    props: [
      { key: "seed", label: "Seed color", kind: "text", default: BASELINE_SEED },
      { key: "variant", label: "Variant", kind: "enum", default: "tonalSpot", options: VARIANTS },
      { key: "contrast", label: "Contrast", kind: "enum", default: "standard", options: ["standard", "medium", "high"] },
      { key: "spec", label: "Spec", kind: "enum", default: "2021", options: ["2021", "2025"] },
      { key: "width", label: "Width", kind: "number", default: 320, min: 240, max: 640, step: 4, unit: "px" },
    ],
    // The providers write the page's <html>, so the canvas draws and prints a scope: the same scheme, limited to a subtree.
    tree: (p) => {
      // a half-typed color would make the scheme builder throw
      const seed = /^#[0-9a-f]{6}$/i.test(p.s("seed")) ? p.s("seed") : BASELINE_SEED;
      return h(
        "M3ThemeScope",
        {
          source: { primary: seed },
          variant: p.s("variant") === "tonalSpot" ? undefined : p.s("variant"),
          contrast: p.s("contrast") === "standard" ? undefined : p.s("contrast"),
          spec: p.s("spec") === "2021" ? undefined : p.s("spec"),
          className: "flex flex-col gap-3 rounded-lg p-4",
          style: { width: Math.round(p.n("width")) },
        },
        h("div", { className: "flex gap-2" }, ...SWATCHES.map((c) => h("div", { className: `size-10 rounded-full ${c}` }))),
        h(
          "div",
          { className: "flex flex-col gap-3 rounded-lg bg-primary-container p-4 text-on-primary-container" },
          h("p", { className: "text-title-medium" }, seed),
          h("div", { className: "flex items-center gap-2" }, h("Button", { size: "sm" }, "Filled"), h("Button", { size: "sm", variant: "tonal" }, "Tonal"), h("Switch", { defaultChecked: true })),
        ),
      );
    },
  },
];
