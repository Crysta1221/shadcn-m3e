import { h, ic, raw, wrap } from "../node";
import type { ListItem, P, PartDef, PartSlot, PropDef } from "../types";

const VARIANTS = ["filled", "tonal", "elevated", "outlined", "text"];
const SIZES = [
  { value: "xs", label: "XS · 32" },
  { value: "sm", label: "S · 40" },
  { value: "md", label: "M · 56" },
  { value: "lg", label: "L · 96" },
  { value: "xl", label: "XL · 136" },
];

/** every entry of a list prop is a place a tap can be sent from: `tab:0`, `tab:1`, … */
const listSlots = (items: ListItem[]): PartSlot[] => items.map((it, i) => ({ key: `tab:${i}`, label: it.label || `${i + 1}`, icon: it.icon }));

/** the props a tappable "toggle" button carries: marked as a toggle, plus what it looks like on */
const TOGGLE_PROPS: PropDef[] = [
  { key: "toggle", label: "Toggle button", kind: "bool", default: false },
  { key: "onIcon", label: "Icon when on", kind: "icon", default: "", when: (p: P) => p.b("toggle") },
  { key: "onLabel", label: "Label when on", kind: "text", default: "", when: (p: P) => p.b("toggle") },
];

/* the toggle the button prints as: a real `Toggle` with its on-look props, variant and size
 *  mapped onto the toggle's own scale (a text button is the standard, containerless toggle;
 *  XL buttons share the largest toggle) */
const TOGGLE_VARIANT: Record<string, string | undefined> = { filled: "filled", tonal: "tonal", elevated: "elevated", outlined: "outline", text: undefined };
const TOGGLE_SIZE: Record<string, string> = { xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "lg" };

/** the button part's tree: a `Button` normally, a `Toggle` when it flips on tap */
function buttonTree(p: P) {
  const label = p.s("label");
  const icon = p.s("icon");
  const iconOnly = !label && !!icon;
  /* a labeled button takes a set width like any other part; an icon-only one takes the
   *  button's own narrow/wide instead of a number of pixels */
  const width = !iconOnly
    ? { style: p.n("width") === 96 ? undefined : { width: Math.round(p.n("width")) } }
    : { width: p.s("iconWidth") === "default" ? undefined : p.s("iconWidth") };
  if (p.b("toggle")) {
    const onIcon = p.s("onIcon");
    const onLabel = p.s("onLabel");
    /* the on-look swaps as a whole, so a half-set look repeats the half it keeps */
    return h(
      "Toggle",
      {
        variant: TOGGLE_VARIANT[p.s("variant")],
        size: TOGGLE_SIZE[p.s("size")] ?? "sm",
        shape: p.s("shape") === "square" ? "square" : undefined,
        disabled: p.b("disabled") || undefined,
        selectedIcon: onIcon ? ic(onIcon, { fill: "auto" }) : onLabel && icon ? ic(icon, { fill: "auto" }) : undefined,
        selectedLabel: onLabel || (onIcon && label ? label : undefined),
        "aria-label": iconOnly && !onIcon ? icon : undefined,
        ...width,
      },
      icon && ic(icon, { fill: "auto" }),
      label,
    );
  }
  return h(
    "Button",
    {
      variant: p.s("variant"),
      size: iconOnly ? `icon-${p.s("size")}` : p.s("size"),
      shape: p.s("shape") === "square" ? "square" : undefined,
      disabled: p.b("disabled") || undefined,
      "aria-label": iconOnly ? icon : undefined,
      ...width,
    },
    icon && ic(icon),
    label,
  );
}

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
      { key: "width", label: "Width", kind: "number", default: 96, min: 48, max: 640, step: 4, unit: "px", when: (p) => !!p.s("label") },
      { key: "iconWidth", label: "Width", kind: "enum", default: "default", options: ["default", "narrow", "wide"], when: (p) => !p.s("label") && !!p.s("icon") },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
      ...TOGGLE_PROPS,
    ],
    tree: (p) => buttonTree(p),
  },
  {
    slug: "fab",
    name: "FAB",
    category: "Actions",
    icon: "add_circle",
    role: "fab",
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
      { key: "lowered", label: "Lowered", kind: "bool", default: false },
      { key: "collapsed", label: "Collapsed (extended)", kind: "bool", default: false, when: (p) => !!p.s("label") },
      ...TOGGLE_PROPS,
    ],
    tree: (p) => {
      const color = p.s("color");
      const size = p.s("size");
      const label = p.s("label");
      const common = { color: color === "primary-container" ? undefined : color, size: size === "default" ? undefined : size, lowered: p.b("lowered") || undefined };
      /* a FAB that flips on tap keeps its look but swaps what it shows (add ↔ close,
       * play ↔ pause); the on-state fills its icon even when it stays the same */
      const toggle = p.b("toggle")
        ? {
            selectedIcon: p.s("onIcon") || p.s("icon") ? ic(p.s("onIcon") || p.s("icon"), { fill: "auto" }) : undefined,
            selectedLabel: p.s("onLabel") || label || undefined,
          }
        : undefined;
      if (label) return h("ExtendedFab", { ...common, collapsed: p.b("collapsed") || undefined, icon: p.s("icon") ? ic(p.s("icon")) : undefined, ...toggle }, label);
      return h("Fab", { ...common, "aria-label": p.s("icon") || "Action", selectedIcon: toggle?.selectedIcon }, ic(p.s("icon") || "add"));
    },
  },
  {
    slug: "chip",
    name: "Chip",
    category: "Actions",
    icon: "label",
    role: "listLike",
    w: 80,
    h: 32,
    props: [
      { key: "items", label: "Chips", kind: "list", default: [{ label: "Chip" }], min: 1, max: 8, icons: true },
      { key: "kind", label: "Kind", kind: "enum", default: "assist", options: ["assist", "filter", "input"] },
      { key: "selected", label: "Selected (filter, -1: none)", kind: "number", default: 0, min: -1, max: 7, step: 1, when: (p) => p.s("kind") === "filter" },
      { key: "variant", label: "Variant", kind: "enum", default: "flat", options: ["flat", "elevated"] },
      { key: "size", label: "Size", kind: "enum", default: "default", options: [{ value: "default", label: "32" }, { value: "md", label: "40" }, { value: "lg", label: "56" }] },
    ],
    slots: (p) => listSlots(p.list("items")),
    tree: (p) => {
      const variant = p.s("variant") === "elevated" ? "elevated" : undefined;
      const size = p.s("size") === "default" ? undefined : p.s("size");
      const items = p.list("items");
      /* an input chip's remove button does nothing in the sketch; the code it prints
       *  calls the handler it is given a name for */
      const chip = (it: { label: string; icon?: string }, i: number) => {
        const props = { variant, size, icon: it.icon || undefined, "data-tap": `tab:${i}` };
        if (p.s("kind") === "filter") return h("FilterChip", { ...props, defaultPressed: i === p.n("selected") || undefined }, it.label);
        if (p.s("kind") === "input") return h("InputChip", { ...props, onRemove: raw("() => {}") }, it.label);
        return h("Chip", props, it.label);
      };
      if (items.length === 1) return chip(items[0], 0);
      return h("div", { className: "flex flex-wrap gap-2" }, ...items.map(chip));
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
    slots: (p) => listSlots(p.list("items")),
    selectKey: "selected",
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
        ...items.map((it, i) => h("ToggleGroupItem", { value: value(it, i), "aria-label": it.label ? undefined : it.icon || value(it, i), "data-tap": `tab:${i}` }, !!it.icon && ic(it.icon, { size: 20, fill: "auto" }), it.label)),
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
        /* a button in a row may take its own look and width over the group's */
        fields: [
          { key: "variant", label: "Variant", options: [{ value: "", label: "Group" }, ...VARIANTS] },
          { key: "width", label: "Width", options: [{ value: "", label: "Group" }, "narrow", "wide"] },
        ],
      },
      { key: "variant", label: "Group", kind: "enum", default: "connected", options: ["connected", "standard"] },
      { key: "orientation", label: "Orientation", kind: "enum", default: "horizontal", options: ["horizontal", "vertical"] },
      { key: "buttonVariant", label: "Button variant", kind: "enum", default: "tonal", options: VARIANTS },
      { key: "size", label: "Size", kind: "enum", default: "sm", options: SIZES },
    ],
    slots: (p) => listSlots(p.list("items")),
    tree: (p) =>
      h(
        "ButtonGroup",
        { variant: p.s("variant") === "standard" ? "standard" : undefined, orientation: p.s("orientation") === "vertical" ? "vertical" : undefined },
        ...p.list("items").map((it, i) => {
          const iconOnly = !it.label && !!it.icon;
          return h(
            "Button",
            {
              variant: it.variant || p.s("buttonVariant"),
              width: it.width || undefined,
              size: iconOnly ? `icon-${p.s("size")}` : p.s("size"),
              "aria-label": iconOnly ? it.icon : undefined,
              "data-tap": `tab:${i}`,
            },
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
      { key: "menuItems", label: "Menu items", kind: "list", default: [{ label: "Duplicate", icon: "content_copy" }, { label: "Share", icon: "share" }, { label: "Delete", icon: "delete" }], min: 1, max: 6, icons: true },
    ],
    open: { box: (p) => ({ w: 220, h: 40 + 8 + p.list("menuItems").length * 44 + 16, ax: "end" }) },
    slots: (p) => listSlots(p.list("menuItems")),
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
        h("DropdownMenuContent", { align: "end", className: "w-48" }, ...items.map((it, i) => h("DropdownMenuItem", { "data-tap": `tab:${i}` }, !!it.icon && ic(it.icon), it.label))),
      );
    },
  },
  {
    slug: "fab-menu",
    name: "FAB menu",
    category: "Actions",
    icon: "menu_open",
    role: "fab",
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
    slots: (p) => listSlots(p.list("items")),
    tree: (p) => {
      const items = p.list("items");
      const menu = h(
        "FabMenu",
        { defaultOpen: p.b("open") || undefined },
        h("FabMenuContent", null, ...items.map((it, i) => h("FabMenuItem", { icon: it.icon ? ic(it.icon) : undefined, "data-tap": `tab:${i}` }, it.label))),
        h("FabMenuTrigger", { icon: p.s("icon") && p.s("icon") !== "add" ? ic(p.s("icon")) : undefined }),
      );
      // the open items stack above the trigger without taking room, so the preview reserves it (56dp each, 4dp apart, 8dp from the FAB)
      return p.b("open") ? h("div", { style: { paddingTop: items.length * 60 + 8 } }, menu) : menu;
    },
  },
];
