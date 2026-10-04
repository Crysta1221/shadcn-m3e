import { h, ic, raw, wrap } from "../node";
import type { PartDef } from "../types";

const VARIANTS = ["filled", "tonal", "elevated", "outlined", "text"];
const SIZES = [
  { value: "xs", label: "XS · 32" },
  { value: "sm", label: "S · 40" },
  { value: "md", label: "M · 56" },
  { value: "lg", label: "L · 96" },
  { value: "xl", label: "XL · 136" },
];

export const actions: PartDef[] = [
  {
    slug: "button",
    name: "Button",
    category: "Actions",
    icon: "touch_app",
    w: 96,
    h: 40,
    props: [
      { key: "label", label: "Label", kind: "text", default: "Button" },
      { key: "icon", label: "Icon", kind: "icon", default: "" },
      { key: "variant", label: "Variant", kind: "enum", default: "filled", options: VARIANTS },
      { key: "size", label: "Size", kind: "enum", default: "sm", options: SIZES },
      { key: "shape", label: "Shape", kind: "enum", default: "round", options: ["round", "square"] },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
    ],
    tree: (p) => {
      const label = p.s("label");
      const icon = p.s("icon");
      const iconOnly = !label && !!icon;
      return h(
        "Button",
        {
          variant: p.s("variant"),
          size: iconOnly ? `icon-${p.s("size")}` : p.s("size"),
          shape: p.s("shape") === "square" ? "square" : undefined,
          disabled: p.b("disabled") || undefined,
          "aria-label": iconOnly ? icon : undefined,
        },
        icon && ic(icon),
        label,
      );
    },
  },
  {
    slug: "fab",
    name: "FAB",
    category: "Actions",
    icon: "add_circle",
    w: 56,
    h: 56,
    props: [
      { key: "icon", label: "Icon", kind: "icon", default: "edit" },
      { key: "label", label: "Label (extended)", kind: "text", default: "" },
      { key: "size", label: "Size", kind: "enum", default: "default", options: ["sm", "default", "md", "lg"] },
      {
        key: "color",
        label: "Color",
        kind: "enum",
        default: "primary-container",
        options: ["primary-container", "secondary-container", "tertiary-container", "primary", "secondary", "tertiary", "surface"],
      },
    ],
    tree: (p) => {
      const color = p.s("color");
      const size = p.s("size");
      const label = p.s("label");
      const common = { color: color === "primary-container" ? undefined : color, size: size === "default" ? undefined : size };
      if (label) return h("ExtendedFab", { ...common, icon: p.s("icon") ? ic(p.s("icon")) : undefined }, label);
      return h("Fab", { ...common, "aria-label": p.s("icon") || "Action" }, ic(p.s("icon") || "add"));
    },
  },
  {
    slug: "chip",
    name: "Chip",
    category: "Actions",
    icon: "label",
    w: 80,
    h: 32,
    props: [
      { key: "label", label: "Label", kind: "text", default: "Chip" },
      { key: "icon", label: "Icon", kind: "icon", default: "" },
      { key: "kind", label: "Kind", kind: "enum", default: "assist", options: ["assist", "filter"] },
      { key: "selected", label: "Selected (filter)", kind: "bool", default: false },
      { key: "variant", label: "Variant", kind: "enum", default: "flat", options: ["flat", "elevated"] },
    ],
    tree: (p) => {
      const variant = p.s("variant") === "elevated" ? "elevated" : undefined;
      const icon = p.s("icon") || undefined;
      if (p.s("kind") === "filter") return h("FilterChip", { variant, icon, defaultPressed: p.b("selected") || undefined }, p.s("label"));
      return h("Chip", { variant, icon }, p.s("label"));
    },
  },
  {
    slug: "toggle",
    name: "Toggle",
    category: "Actions",
    icon: "toggle_on",
    w: 40,
    h: 40,
    props: [
      { key: "icon", label: "Icon", kind: "icon", default: "favorite" },
      { key: "label", label: "Label", kind: "text", default: "" },
      { key: "variant", label: "Variant", kind: "enum", default: "default", options: [{ value: "default", label: "standard" }, "filled", "tonal", "outline", "elevated"] },
      { key: "size", label: "Size", kind: "enum", default: "default", options: ["xs", "sm", "default", "md", "lg"] },
      { key: "shape", label: "Shape", kind: "enum", default: "round", options: ["round", "square"] },
      { key: "pressed", label: "Selected", kind: "bool", default: false },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
    ],
    tree: (p) => {
      const label = p.s("label");
      const icon = p.s("icon");
      return h(
        "Toggle",
        {
          variant: p.s("variant") === "default" ? undefined : p.s("variant"),
          size: p.s("size") === "default" ? undefined : p.s("size"),
          shape: p.s("shape") === "square" ? "square" : undefined,
          defaultPressed: p.b("pressed") || undefined,
          disabled: p.b("disabled") || undefined,
          "aria-label": !label ? icon || "Toggle" : undefined,
        },
        !!icon && ic(icon, { fill: "auto" }),
        label,
      );
    },
  },
  {
    slug: "toggle-group",
    name: "Toggle group",
    category: "Actions",
    icon: "view_column",
    w: 220,
    h: 40,
    props: [
      { key: "items", label: "Items", kind: "list", default: [{ label: "Day" }, { label: "Week" }, { label: "Month" }, { label: "Year" }], min: 2, max: 6, icons: true },
      { key: "selected", label: "Selected", kind: "number", default: 1, min: 0, max: 5, step: 1 },
      { key: "connected", label: "Connected", kind: "bool", default: true },
      { key: "variant", label: "Variant", kind: "enum", default: "default", options: [{ value: "default", label: "standard" }, "filled", "tonal", "outline", "elevated"] },
      { key: "size", label: "Size", kind: "enum", default: "default", options: ["xs", "sm", "default", "md"] },
      { key: "multiple", label: "Multiple", kind: "bool", default: false },
    ],
    tree: (p) => {
      const items = p.list("items");
      const value = (it: { label: string; icon?: string }, i: number) => it.label || it.icon || `item-${i + 1}`;
      return h(
        "ToggleGroup",
        {
          spacing: p.b("connected") ? 0 : undefined,
          variant: p.s("variant") === "default" ? undefined : p.s("variant"),
          size: p.s("size") === "default" ? undefined : p.s("size"),
          multiple: p.b("multiple") || undefined,
          defaultValue: items.length ? [value(items[Math.min(p.n("selected"), items.length - 1)], Math.min(p.n("selected"), items.length - 1))] : undefined,
        },
        ...items.map((it, i) => h("ToggleGroupItem", { value: value(it, i), "aria-label": it.label ? undefined : it.icon || value(it, i) }, !!it.icon && ic(it.icon, { size: 20, fill: "auto" }), it.label)),
      );
    },
  },
  {
    slug: "button-group",
    name: "Button group",
    category: "Actions",
    icon: "splitscreen",
    w: 280,
    h: 40,
    props: [
      {
        key: "items",
        label: "Buttons",
        kind: "list",
        default: [
          { label: "Rewind", icon: "fast_rewind" },
          { label: "Play", icon: "play_arrow" },
          { label: "Forward", icon: "fast_forward" },
        ],
        min: 2,
        max: 5,
        icons: true,
      },
      { key: "variant", label: "Group", kind: "enum", default: "connected", options: ["connected", "standard"] },
      { key: "orientation", label: "Orientation", kind: "enum", default: "horizontal", options: ["horizontal", "vertical"] },
      { key: "buttonVariant", label: "Button variant", kind: "enum", default: "tonal", options: VARIANTS },
      { key: "size", label: "Size", kind: "enum", default: "sm", options: SIZES },
    ],
    tree: (p) =>
      h(
        "ButtonGroup",
        { variant: p.s("variant") === "standard" ? "standard" : undefined, orientation: p.s("orientation") === "vertical" ? "vertical" : undefined },
        ...p.list("items").map((it) => {
          const iconOnly = !it.label && !!it.icon;
          return h(
            "Button",
            { variant: p.s("buttonVariant"), size: iconOnly ? `icon-${p.s("size")}` : p.s("size"), "aria-label": iconOnly ? it.icon : undefined },
            !!it.icon && ic(it.icon),
            it.label,
          );
        }),
      ),
  },
  {
    slug: "split-button",
    name: "Split button",
    category: "Actions",
    icon: "arrow_drop_down_circle",
    w: 120,
    h: 40,
    props: [
      { key: "label", label: "Label", kind: "text", default: "Edit" },
      { key: "icon", label: "Icon", kind: "icon", default: "edit" },
      { key: "variant", label: "Variant", kind: "enum", default: "filled", options: VARIANTS },
      { key: "size", label: "Size", kind: "enum", default: "sm", options: SIZES },
      { key: "menu", label: "Menu", kind: "bool", default: true },
      { key: "menuItems", label: "Menu items", kind: "list", default: [{ label: "Duplicate" }, { label: "Share" }, { label: "Delete" }], min: 1, max: 6 },
    ],
    open: { box: (p) => ({ w: 220, h: 40 + 8 + p.list("menuItems").length * 44 + 16, ax: "end" }) },
    tree: (p) => {
      const menu = p.b("menu");
      const items = p.list("menuItems");
      const split = h(
        "SplitButton",
        {
          variant: p.s("variant"),
          size: p.s("size") === "sm" ? undefined : p.s("size"),
          // the menu trigger is the trailing button itself; the canvas draws the closed state, so the callback is code only
          renderTrailing: menu ? wrap("DropdownMenuTrigger") : undefined,
        },
        !!p.s("icon") && ic(p.s("icon"), { size: 20 }),
        p.s("label"),
      );
      if (!menu) return split;
      return h(
        "DropdownMenu",
        null,
        split,
        h("DropdownMenuContent", { align: "end", className: "w-48" }, ...items.map((it) => h("DropdownMenuItem", null, it.label))),
      );
    },
  },
  {
    slug: "fab-menu",
    name: "FAB menu",
    category: "Actions",
    icon: "menu_open",
    w: 56,
    h: 56,
    props: [
      {
        key: "items",
        label: "Actions",
        kind: "list",
        default: [
          { label: "Mail", icon: "mail" },
          { label: "Event", icon: "event" },
          { label: "Task", icon: "task_alt" },
        ],
        min: 1,
        max: 6,
        icons: true,
      },
      { key: "icon", label: "Trigger icon", kind: "icon", default: "add" },
      { key: "open", label: "Open", kind: "bool", default: false },
    ],
    tree: (p) => {
      const items = p.list("items");
      const menu = h(
        "FabMenu",
        { defaultOpen: p.b("open") || undefined },
        h("FabMenuContent", null, ...items.map((it) => h("FabMenuItem", { icon: it.icon ? ic(it.icon) : undefined }, it.label))),
        h("FabMenuTrigger", { icon: p.s("icon") && p.s("icon") !== "add" ? ic(p.s("icon")) : undefined }),
      );
      // the open items stack above the trigger without taking room, so the preview reserves it (56dp each, 4dp apart, 8dp from the FAB)
      return p.b("open") ? h("div", { style: { paddingTop: items.length * 60 + 8 } }, menu) : menu;
    },
  },
];
