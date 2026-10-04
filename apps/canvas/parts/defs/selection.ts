import { h } from "../node";
import type { PartDef } from "../types";

export const selection: PartDef[] = [
  {
    slug: "switch",
    name: "Switch",
    category: "Selection",
    icon: "toggle_on",
    role: "control",
    w: 140,
    h: 32,
    props: [
      { key: "label", label: "Label", kind: "text", default: "Wi-Fi" },
      { key: "checked", label: "On", kind: "bool", default: true },
      { key: "size", label: "Size", kind: "enum", default: "default", options: ["default", "sm"] },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 140, min: 52, max: 520, step: 4, unit: "px", when: (p) => !!p.s("label") },
    ],
    /* a labeled switch spreads its words and its track to the row's ends like the old sketch */
    tree: (p) =>
      h(
        "Label",
        { style: p.s("label") && p.n("width") !== 140 ? { width: Math.round(p.n("width")), justifyContent: "space-between" } : undefined },
        p.s("label"),
        h("Switch", { defaultChecked: p.b("checked") || undefined, size: p.s("size") === "sm" ? "sm" : undefined, disabled: p.b("disabled") || undefined }),
      ),
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "Selection",
    icon: "check_box",
    role: "control",
    w: 140,
    h: 24,
    props: [
      { key: "label", label: "Label", kind: "text", default: "Accept terms" },
      { key: "checked", label: "Checked", kind: "bool", default: true },
      { key: "indeterminate", label: "Indeterminate", kind: "bool", default: false },
      { key: "error", label: "Error", kind: "bool", default: false },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
    ],
    tree: (p) =>
      h(
        "Label",
        null,
        h("Checkbox", {
          defaultChecked: p.b("checked") || undefined,
          indeterminate: p.b("indeterminate") || undefined,
          "aria-invalid": p.b("error") || undefined,
          disabled: p.b("disabled") || undefined,
        }),
        p.s("label"),
      ),
  },
  {
    slug: "radio-group",
    name: "Radio group",
    category: "Selection",
    icon: "radio_button_checked",
    role: "listLike",
    w: 140,
    h: 104,
    props: [
      { key: "items", label: "Options", kind: "list", default: [{ label: "Default" }, { label: "Comfortable" }, { label: "Compact" }], min: 2, max: 6 },
      { key: "selected", label: "Selected", kind: "number", default: 1, min: 0, max: 5, step: 1 },
      { key: "layout", label: "Layout", kind: "enum", default: "column", options: ["column", "row"] },
      { key: "error", label: "Error", kind: "bool", default: false },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
    ],
    tree: (p) => {
      const items = p.list("items");
      return h(
        "RadioGroup",
        {
          defaultValue: items[Math.min(p.n("selected"), items.length - 1)]?.label,
          className: p.s("layout") === "row" ? "flex w-fit gap-6" : "w-fit",
          disabled: p.b("disabled") || undefined,
        },
        ...items.map((it) => h("Label", null, h("RadioGroupItem", { value: it.label, "aria-invalid": p.b("error") || undefined }), it.label)),
      );
    },
  },
  {
    slug: "slider",
    name: "Slider",
    category: "Selection",
    icon: "tune",
    w: 280,
    h: 44,
    props: [
      { key: "value", label: "Value", kind: "number", default: 40, min: 0, max: 100, step: 1 },
      { key: "range", label: "Range", kind: "bool", default: false },
      { key: "end", label: "Range end", kind: "number", default: 70, min: 0, max: 100, step: 1 },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 280, min: 120, max: 520, step: 4, unit: "px" },
    ],
    // the slider keeps its own --slider-gap in `style`, so the width goes on a wrapper
    tree: (p) =>
      h(
        "div",
        { style: { width: Math.round(p.n("width")) } },
        h("Slider", {
          defaultValue: p.b("range") ? [Math.min(p.n("value"), p.n("end")), Math.max(p.n("value"), p.n("end"))] : [p.n("value")],
          disabled: p.b("disabled") || undefined,
        }),
      ),
  },
  {
    slug: "select",
    name: "Select",
    category: "Selection",
    icon: "arrow_drop_down_circle",
    role: "listLike",
    w: 224,
    h: 56,
    props: [
      { key: "items", label: "Options", kind: "list", default: [{ label: "Apple" }, { label: "Banana" }, { label: "Cherry" }], min: 1, max: 8 },
      { key: "selected", label: "Selected (-1: none)", kind: "number", default: 0, min: -1, max: 7, step: 1 },
      { key: "placeholder", label: "Placeholder", kind: "text", default: "Select a fruit" },
      { key: "size", label: "Size", kind: "enum", default: "default", options: ["default", "sm"] },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 224, min: 120, max: 520, step: 4, unit: "px" },
    ],
    open: { box: (p) => ({ w: Math.max(p.n("width"), 200) + 16, h: 56 + 4 + p.list("items").length * 44 + 16 }) },
    tree: (p) => {
      const items = p.list("items");
      const selected = items[p.n("selected")];
      return h(
        "Select",
        { items: items.map((it) => ({ value: it.label, label: it.label })), defaultValue: selected?.label, disabled: p.b("disabled") || undefined },
        h(
          "SelectTrigger",
          { size: p.s("size") === "sm" ? "sm" : undefined, style: { width: Math.round(p.n("width")) } },
          h("SelectValue", { placeholder: p.s("placeholder") || undefined }),
        ),
        h("SelectContent", null, ...items.map((it) => h("SelectItem", { value: it.label }, it.label))),
      );
    },
  },
  {
    slug: "native-select",
    name: "Native select",
    category: "Selection",
    icon: "list",
    role: "listLike",
    w: 224,
    h: 56,
    props: [
      { key: "items", label: "Options", kind: "list", default: [{ label: "Option A" }, { label: "Option B" }, { label: "Option C" }], min: 1, max: 8 },
      { key: "selected", label: "Selected", kind: "number", default: 1, min: 0, max: 7, step: 1 },
      { key: "size", label: "Size", kind: "enum", default: "default", options: ["default", "sm"] },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 224, min: 120, max: 520, step: 4, unit: "px" },
    ],
    tree: (p) => {
      const items = p.list("items");
      return h(
        "NativeSelect",
        {
          size: p.s("size") === "sm" ? "sm" : undefined,
          defaultValue: items[Math.min(p.n("selected"), items.length - 1)]?.label,
          disabled: p.b("disabled") || undefined,
          style: { width: Math.round(p.n("width")) },
        },
        ...items.map((it) => h("NativeSelectOption", { value: it.label }, it.label)),
      );
    },
  },
  {
    slug: "combobox",
    name: "Combobox",
    category: "Selection",
    icon: "manage_search",
    role: "listLike",
    w: 256,
    h: 56,
    props: [
      { key: "items", label: "Options", kind: "list", default: [{ label: "Next.js" }, { label: "SvelteKit" }, { label: "Nuxt" }, { label: "Remix" }, { label: "Astro" }], min: 1, max: 10 },
      { key: "selected", label: "Selected (-1: none)", kind: "number", default: -1, min: -1, max: 9, step: 1 },
      { key: "placeholder", label: "Placeholder", kind: "text", default: "Select a framework" },
      { key: "clear", label: "Clear button", kind: "bool", default: false },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 256, min: 120, max: 520, step: 4, unit: "px" },
    ],
    open: { box: (p) => ({ w: Math.max(p.n("width"), 200), h: 56 + 8 + Math.min(p.list("items").length, 6) * 44 + 16 }) },
    tree: (p) => {
      const items = p.list("items");
      return h(
        "div",
        { style: { width: Math.round(p.n("width")) } },
        h(
          "Combobox",
          { items: items.map((it) => it.label), defaultValue: items[p.n("selected")]?.label, disabled: p.b("disabled") || undefined },
          h("ComboboxInput", { placeholder: p.s("placeholder") || undefined, showClear: p.b("clear") || undefined, className: "w-full" }),
          h(
            "ComboboxContent",
            null,
            h("ComboboxEmpty", null, "No items found."),
            h("ComboboxList", null, ...items.map((it) => h("ComboboxItem", { value: it.label }, it.label))),
          ),
        ),
      );
    },
  },
];
