import { h, ic } from "../node";
import type { PartDef } from "../types";

const TONES = [
  "bg-primary-container text-on-primary-container",
  "bg-secondary-container text-on-secondary-container",
  "bg-tertiary-container text-on-tertiary-container",
];

/** the Material shape library, in the order of the docs page */
const SHAPES = [
  "4-leaf-clover", "4-sided-cookie", "6-sided-cookie", "7-sided-cookie", "8-leaf-clover", "9-sided-cookie", "12-sided-cookie",
  "burst", "oval", "pentagon", "pill", "soft-burst", "sunny", "very-sunny", "bun", "boom", "arch", "arrow", "diamond", "fan",
  "flower", "gem", "ghost-ish", "heart", "hexagon", "pixel-circle", "pixel-triangle", "puffy", "puffy-diamond", "semicircle",
  "slanted", "soft-boom", "square", "circle", "triangle",
];

const ICON_COLORS: Record<string, string | undefined> = {
  default: undefined,
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  error: "text-error",
};

const SHAPE_COLORS: Record<string, string | undefined> = {
  primary: undefined,
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
  "primary-container": "bg-primary-container",
  "tertiary-container": "bg-tertiary-container",
  error: "bg-error",
};

const RATIOS: Record<string, number> = { "16:9": 16 / 9, "4:3": 4 / 3, "1:1": 1, "3:4": 3 / 4, "21:9": 21 / 9 };

const INITIALS = ["A", "B", "C", "D", "E"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const DESKTOP = [186, 305, 237, 73, 209, 214];
const MOBILE = [80, 200, 120, 190, 130, 140];

const INVOICES = [
  ["INV001", "Paid", "$250.00", "Jan 4"],
  ["INV002", "Pending", "$150.00", "Jan 9"],
  ["INV003", "Unpaid", "$350.00", "Jan 15"],
  ["INV004", "Paid", "$450.00", "Jan 21"],
  ["INV005", "Paid", "$550.00", "Jan 28"],
  ["INV006", "Pending", "$200.00", "Feb 2"],
];

const px = (n: number) => Math.round(n);

export const content: PartDef[] = [
  {
    slug: "icon",
    name: "Icon",
    category: "Content",
    icon: "emoji_symbols",
    w: 24,
    h: 24,
    props: [
      { key: "name", label: "Icon", kind: "icon", default: "favorite" },
      { key: "size", label: "Size", kind: "number", default: 24, min: 16, max: 96, step: 4, unit: "px" },
      { key: "filled", label: "Filled", kind: "bool", default: false },
      { key: "color", label: "Color", kind: "enum", default: "default", options: ["default", "primary", "secondary", "tertiary", "error"] },
    ],
    tree: (p) =>
      h("Icon", {
        name: p.s("name") || "favorite",
        size: p.n("size") === 24 ? undefined : px(p.n("size")),
        fill: p.b("filled") || undefined,
        className: ICON_COLORS[p.s("color")],
      }),
  },
  {
    slug: "avatar",
    name: "Avatar",
    category: "Content",
    icon: "account_circle",
    w: 40,
    h: 40,
    props: [
      { key: "initials", label: "Initials", kind: "text", default: "TK" },
      { key: "size", label: "Size", kind: "enum", default: "default", options: ["sm", "default", "lg"] },
      { key: "image", label: "Image", kind: "image" },
      { key: "count", label: "People (a group when more than one)", kind: "number", default: 1, min: 1, max: 5, step: 1 },
    ],
    tree: (p) => {
      const size = p.s("size") === "default" ? undefined : p.s("size");
      if (p.n("count") <= 1)
        return h("Avatar", { size }, p.s("image") && h("AvatarImage", { src: p.s("image"), alt: p.s("initials") || "Avatar" }), h("AvatarFallback", null, p.s("initials")));
      return h(
        "AvatarGroup",
        null,
        ...INITIALS.slice(0, px(p.n("count"))).map((l) => h("Avatar", { size }, h("AvatarFallback", null, l))),
      );
    },
  },
  {
    slug: "carousel",
    name: "Carousel (Embla)",
    category: "Content",
    icon: "view_carousel",
    role: "fullWidth",
    /* the slides are the tree's only divs: the fill and corners land on each of them */
    appearance: { target: "div", radius: 28 },
    w: 320,
    h: 200,
    props: [
      { key: "count", label: "Slides", kind: "number", default: 5, min: 2, max: 8, step: 1 },
      { key: "arrows", label: "Arrows", kind: "bool", default: true },
      { key: "orientation", label: "Orientation", kind: "enum", default: "horizontal", options: ["horizontal", "vertical"] },
      { key: "itemWidth", label: "Slide width (0: full)", kind: "number", default: 0, min: 0, max: 480, step: 4, unit: "px" },
      { key: "gap", label: "Gap", kind: "number", default: 16, min: 0, max: 32, step: 2, unit: "px" },
      { key: "image", label: "Image", kind: "image" },
      { key: "width", label: "Width", kind: "number", default: 320, min: 160, max: 640, step: 4, unit: "px" },
      { key: "height", label: "Slide height", kind: "number", default: 200, min: 80, max: 400, step: 4, unit: "px" },
    ],
    slots: (p) => Array.from({ length: px(p.n("count")) }, (_, i) => ({ key: `tab:${i}`, label: `${i + 1}` })),
    tree: (p) => {
      const vertical = p.s("orientation") === "vertical";
      const gap = px(p.n("gap"));
      const slideW = px(p.n("itemWidth"));
      const src = p.s("image");
      const pad = vertical ? { paddingTop: gap } : { paddingLeft: gap };
      return h(
        "Carousel",
        { orientation: vertical ? "vertical" : undefined, className: "mx-auto", style: { width: px(p.n("width")) } },
        h(
          "CarouselContent",
          { style: vertical ? { marginTop: -gap } : { marginLeft: -gap } },
          ...Array.from({ length: px(p.n("count")) }, (_, i) =>
            h(
              "CarouselItem",
              { style: { ...pad, ...(slideW > 0 ? { flexBasis: slideW } : {}) } },
              h(
                "div",
                { className: `flex items-center justify-center overflow-hidden rounded-2xl text-headline-large ${src ? "bg-surface-container-highest" : TONES[i % 3]}`, style: { height: px(p.n("height")) }, "data-tap": `tab:${i}` },
                src ? h("img", { src, alt: `Slide ${i + 1}`, className: "size-full object-cover" }) : String(i + 1),
              ),
            ),
          ),
        ),
        p.b("arrows") && h("CarouselPrevious"),
        p.b("arrows") && h("CarouselNext"),
      );
    },
  },
  {
    slug: "expressive-carousel",
    name: "Expressive carousel",
    category: "Content",
    icon: "view_carousel",
    role: "fullWidth",
    appearance: { target: "CarouselSlide", radius: 28 },
    w: 420,
    h: 180,
    props: [
      { key: "variant", label: "Variant", kind: "enum", default: "multi-browse", options: ["multi-browse", "hero", "uncontained", "full-screen"] },
      {
        key: "slides",
        label: "Slides",
        kind: "list",
        default: [{ label: "Sunrise" }, { label: "Forest" }, { label: "Ocean" }, { label: "Desert" }, { label: "Glacier" }, { label: "Canyon" }],
        min: 3,
        max: 8,
      },
      { key: "itemWidth", label: "Slide width", kind: "number", default: 186, min: 120, max: 400, step: 4, unit: "px", when: (p) => p.s("variant") !== "full-screen" },
      { key: "gap", label: "Gap", kind: "number", default: 8, min: 0, max: 24, step: 2, unit: "px" },
      { key: "height", label: "Height", kind: "number", default: 180, min: 100, max: 320, step: 4, unit: "px" },
      { key: "width", label: "Width", kind: "number", default: 420, min: 240, max: 800, step: 4, unit: "px" },
    ],
    slots: (p) => p.list("slides").map((s, i) => ({ key: `tab:${i}`, label: s.label || `${i + 1}` })),
    tree: (p) =>
      h(
        "ExpressiveCarousel",
        { variant: p.s("variant"), itemWidth: p.s("variant") === "full-screen" ? undefined : px(p.n("itemWidth")), gap: px(p.n("gap")), height: px(p.n("height")), style: { width: px(p.n("width")) } },
        ...p.list("slides").map((s, i) => h("CarouselSlide", { className: TONES[i % 3], "data-tap": `tab:${i}` }, h("span", { className: "text-title-large" }, s.label))),
      ),
  },
  {
    slug: "table",
    name: "Table",
    category: "Content",
    icon: "table",
    w: 420,
    h: 160,
    props: [
      {
        key: "columns",
        label: "Columns",
        kind: "list",
        default: [{ label: "Invoice" }, { label: "Status" }, { label: "Amount" }],
        min: 2,
        max: 4,
      },
      { key: "rows", label: "Rows", kind: "number", default: 3, min: 1, max: 6, step: 1 },
      { key: "selected", label: "Selected row (0 for none)", kind: "number", default: 0, min: 0, max: 6, step: 1 },
      { key: "caption", label: "Caption", kind: "text", default: "Recent invoices" },
      { key: "width", label: "Width", kind: "number", default: 420, min: 200, max: 800, step: 4, unit: "px" },
    ],
    tree: (p) => {
      const columns = p.list("columns");
      const last = columns.length - 1;
      // the last column holds the amounts of the sample data, so it is right-aligned like the docs demo
      const align = (c: number) => (c === last ? "text-right" : undefined);
      return h(
        "div",
        { style: { width: px(p.n("width")) } },
        h(
          "Table",
          null,
          p.s("caption") && h("TableCaption", null, p.s("caption")),
          h("TableHeader", null, h("TableRow", null, ...columns.map((c, i) => h("TableHead", { className: align(i) }, c.label)))),
          h(
            "TableBody",
            null,
            ...INVOICES.slice(0, px(p.n("rows"))).map((row, r) =>
              h(
                "TableRow",
                { "data-state": p.n("selected") === r + 1 ? "selected" : undefined },
                ...columns.map((_, c) => h("TableCell", { className: align(c) }, c === last ? row[2] : [row[0], row[1], row[3]][c])),
              ),
            ),
          ),
        ),
      );
    },
  },
  {
    slug: "chart",
    name: "Chart",
    category: "Content",
    icon: "bar_chart",
    w: 420,
    h: 224,
    props: [
      { key: "bars", label: "Months", kind: "number", default: 4, min: 3, max: 6, step: 1 },
      { key: "series", label: "Series", kind: "number", default: 2, min: 1, max: 2, step: 1 },
      { key: "width", label: "Width", kind: "number", default: 420, min: 200, max: 800, step: 4, unit: "px" },
      { key: "height", label: "Height", kind: "number", default: 224, min: 120, max: 400, step: 4, unit: "px" },
    ],
    tree: (p) => {
      const months = MONTHS.slice(0, px(p.n("bars")));
      const data = months.map((month, i) => ({ month, desktop: DESKTOP[i], mobile: MOBILE[i] }));
      return h(
        "ChartContainer",
        {
          config: {
            desktop: { label: "Desktop", color: "var(--chart-1)" },
            mobile: { label: "Mobile", color: "var(--chart-2)" },
          },
          style: { width: px(p.n("width")), height: px(p.n("height")) },
        },
        h(
          "BarChart",
          { data },
          h("CartesianGrid", { vertical: false }),
          h("XAxis", { dataKey: "month", tickLine: false, axisLine: false }),
          h("ChartTooltip", { content: h("ChartTooltipContent") }),
          h("Bar", { dataKey: "desktop", fill: "var(--color-desktop)", radius: 4 }),
          p.n("series") > 1 && h("Bar", { dataKey: "mobile", fill: "var(--color-mobile)", radius: 4 }),
        ),
      );
    },
  },
  {
    slug: "kbd",
    name: "Kbd",
    category: "Content",
    icon: "keyboard",
    w: 80,
    h: 24,
    props: [
      { key: "keys", label: "Keys", kind: "list", default: [{ label: "Ctrl" }, { label: "K" }], min: 1, max: 4 },
      { key: "caption", label: "Caption", kind: "text", default: "" },
    ],
    tree: (p) => {
      const keys = p.list("keys");
      const shortcut = keys.length > 1 ? h("KbdGroup", null, ...keys.map((k) => h("Kbd", null, k.label))) : h("Kbd", null, keys[0]?.label ?? "");
      return p.s("caption") ? h("div", { className: "flex items-center gap-2 text-body-medium text-on-surface-variant" }, shortcut, p.s("caption")) : shortcut;
    },
  },
  {
    slug: "aspect-ratio",
    name: "Aspect ratio",
    category: "Content",
    icon: "aspect_ratio",
    w: 288,
    h: 162,
    props: [
      { key: "ratio", label: "Ratio", kind: "enum", default: "16:9", options: Object.keys(RATIOS) },
      { key: "label", label: "Label", kind: "text", default: "16:9" },
      { key: "width", label: "Width", kind: "number", default: 288, min: 120, max: 640, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h(
        "div",
        { style: { width: px(p.n("width")) } },
        h(
          "AspectRatio",
          { ratio: Math.round((RATIOS[p.s("ratio")] ?? 16 / 9) * 10000) / 10000 },
          h("div", { className: "flex size-full items-center justify-center rounded-lg bg-tertiary-container text-title-large text-on-tertiary-container" }, p.s("label")),
        ),
      ),
  },
  {
    slug: "empty",
    name: "Empty",
    category: "Content",
    icon: "inbox",
    appearance: { radius: 16 },
    w: 360,
    h: 280,
    props: [
      { key: "title", label: "Title", kind: "text", default: "No messages" },
      { key: "description", label: "Description", kind: "text", default: "New messages will show up here.", multiline: true },
      { key: "icon", label: "Icon", kind: "icon", default: "inbox" },
      { key: "action", label: "Action button", kind: "text", default: "Compose" },
      { key: "bordered", label: "Dashed border", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 360, min: 200, max: 640, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h(
        "Empty",
        { className: p.b("bordered") ? "border" : undefined, style: { width: px(p.n("width")) } },
        h(
          "EmptyHeader",
          null,
          p.s("icon") && h("EmptyMedia", { variant: "icon" }, ic(p.s("icon"))),
          h("EmptyTitle", null, p.s("title")),
          p.s("description") && h("EmptyDescription", null, p.s("description")),
        ),
        p.s("action") && h("EmptyContent", null, h("Button", { variant: "tonal" }, p.s("action"))),
      ),
  },
  {
    slug: "shape",
    name: "Shape",
    category: "Content",
    icon: "interests",
    w: 96,
    h: 96,
    props: [
      { key: "name", label: "Shape", kind: "enum", default: "sunny", options: SHAPES },
      { key: "color", label: "Color", kind: "enum", default: "primary", options: Object.keys(SHAPE_COLORS) },
      { key: "size", label: "Size", kind: "number", default: 96, min: 24, max: 240, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h("Shape", {
        name: p.s("name"),
        className: SHAPE_COLORS[p.s("color")],
        style: { width: px(p.n("size")), height: px(p.n("size")) },
      }),
  },
];
