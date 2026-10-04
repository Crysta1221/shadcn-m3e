import { h, ic, raw } from "../node";
import type { PNode } from "../node";
import { around, type PartDef } from "../types";

const BUTTON_VARIANTS = ["filled", "tonal", "elevated", "outlined", "text"];

export const communication: PartDef[] = [
  {
    slug: "badge",
    name: "Badge",
    category: "Communication",
    icon: "notifications",
    w: 72,
    h: 24,
    props: [
      { key: "kind", label: "Kind", kind: "enum", default: "label", options: [{ value: "label", label: "Label" }, { value: "dot", label: "Dot on an icon" }, { value: "count", label: "Count on an icon" }] },
      { key: "label", label: "Label", kind: "text", default: "Badge" },
      { key: "variant", label: "Variant", kind: "enum", default: "default", options: ["default", "secondary", "tertiary", "destructive", "outline", "ghost", "link"] },
      { key: "icon", label: "Icon (dot, count)", kind: "icon", default: "notifications" },
      { key: "count", label: "Count", kind: "number", default: 8, min: 1, max: 2000, step: 1 },
    ],
    tree: (p) => {
      const kind = p.s("kind");
      if (kind === "label") return h("Badge", { variant: p.s("variant") === "default" ? undefined : p.s("variant") }, p.s("label"));
      const icon = ic(p.s("icon") || "notifications", { size: 32 });
      const badge =
        kind === "dot"
          ? h("NotificationBadge", { className: "absolute top-0 right-0" })
          : h("NotificationBadge", { count: Math.round(p.n("count")), className: "absolute -top-1 left-5" });
      return h("span", { className: "relative inline-flex" }, icon, badge);
    },
  },
  {
    slug: "progress",
    name: "Progress",
    category: "Communication",
    icon: "linear_scale",
    w: 280,
    h: 4,
    props: [
      { key: "value", label: "Value", kind: "number", default: 60, min: 0, max: 100, step: 1, unit: "%" },
      { key: "indeterminate", label: "Indeterminate", kind: "bool", default: false },
      { key: "variant", label: "Variant", kind: "enum", default: "flat", options: ["flat", "wavy"] },
      { key: "thickness", label: "Thickness", kind: "number", default: 4, min: 2, max: 16, step: 1, unit: "px" },
      { key: "label", label: "Label", kind: "text", default: "" },
      { key: "showValue", label: "Show value", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 280, min: 80, max: 560, step: 4, unit: "px" },
    ],
    tree: (p) => {
      const label = p.s("label");
      const showValue = p.b("showValue") && !p.b("indeterminate");
      return h(
        "Progress",
        {
          // null prints as `value={null}`; the canvas has no value, which is just as indeterminate
          value: p.b("indeterminate") ? raw("null") : Math.round(p.n("value")),
          variant: p.s("variant") === "flat" ? undefined : p.s("variant"),
          thickness: Math.round(p.n("thickness")) === 4 ? undefined : Math.round(p.n("thickness")),
          style: { width: Math.round(p.n("width")) },
        },
        label && h("ProgressLabel", null, label),
        showValue && h("ProgressValue"),
      );
    },
  },
  {
    slug: "circular-progress",
    name: "Circular progress",
    category: "Communication",
    icon: "progress_activity",
    w: 40,
    h: 40,
    props: [
      { key: "value", label: "Value", kind: "number", default: 70, min: 0, max: 100, step: 1, unit: "%" },
      { key: "indeterminate", label: "Indeterminate", kind: "bool", default: false },
      { key: "variant", label: "Variant", kind: "enum", default: "flat", options: ["flat", "wavy"] },
      { key: "size", label: "Size", kind: "number", default: 40, min: 24, max: 120, step: 2, unit: "px" },
      { key: "thickness", label: "Thickness", kind: "number", default: 4, min: 2, max: 16, step: 1, unit: "px" },
    ],
    tree: (p) =>
      h("CircularProgress", {
        value: p.b("indeterminate") ? undefined : Math.round(p.n("value")),
        variant: p.s("variant") === "flat" ? undefined : p.s("variant"),
        size: Math.round(p.n("size")),
        thickness: Math.round(p.n("thickness")) === 4 ? undefined : Math.round(p.n("thickness")),
      }),
  },
  {
    slug: "loading-indicator",
    name: "Loading indicator",
    category: "Communication",
    icon: "hourglass_top",
    w: 48,
    h: 48,
    props: [
      { key: "variant", label: "Variant", kind: "enum", default: "default", options: ["default", "contained"] },
      { key: "size", label: "Size", kind: "number", default: 48, min: 24, max: 128, step: 4, unit: "px" },
      { key: "speed", label: "Speed", kind: "number", default: 1, min: 0, max: 3, step: 0.25 },
    ],
    tree: (p) =>
      h("LoadingIndicator", {
        variant: p.s("variant") === "default" ? undefined : p.s("variant"),
        size: p.n("size") === 48 ? undefined : Math.round(p.n("size")),
        speed: p.n("speed") === 1 ? undefined : p.n("speed"),
      }),
  },
  {
    slug: "spinner",
    name: "Spinner",
    category: "Communication",
    icon: "sync",
    w: 20,
    h: 20,
    props: [
      {
        key: "size",
        label: "Size",
        kind: "enum",
        default: "sm",
        options: [
          { value: "xs", label: "16" },
          { value: "sm", label: "20" },
          { value: "md", label: "32" },
          { value: "lg", label: "48" },
        ],
      },
      { key: "color", label: "Color", kind: "enum", default: "primary", options: ["primary", "secondary", "tertiary", "error", "on-surface"] },
    ],
    tree: (p) => {
      // literal class names: Tailwind only sees what is written out
      const size = { xs: "size-4", sm: undefined, md: "size-8", lg: "size-12" }[p.s("size")];
      const color = { primary: undefined, secondary: "text-secondary", tertiary: "text-tertiary", error: "text-error", "on-surface": "text-on-surface" }[p.s("color")];
      const className = [size, color].filter(Boolean).join(" ");
      return h("Spinner", { className: className || undefined });
    },
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "Communication",
    icon: "hourglass_empty",
    w: 280,
    h: 48,
    props: [
      { key: "layout", label: "Layout", kind: "enum", default: "profile", options: [{ value: "profile", label: "Avatar and lines" }, { value: "text", label: "Text lines" }, { value: "card", label: "Card" }, { value: "block", label: "Block" }] },
      { key: "lines", label: "Lines (text)", kind: "number", default: 3, min: 1, max: 8, step: 1 },
      { key: "width", label: "Width", kind: "number", default: 280, min: 80, max: 560, step: 4, unit: "px" },
      { key: "height", label: "Height (block)", kind: "number", default: 96, min: 8, max: 320, step: 4, unit: "px" },
    ],
    tree: (p) => {
      const width = Math.round(p.n("width"));
      switch (p.s("layout")) {
        case "text": {
          const lines = Math.round(p.n("lines"));
          const rows: PNode[] = [];
          for (let i = 0; i < lines; i++) rows.push(h("Skeleton", { className: i === lines - 1 && lines > 1 ? "h-4 w-2/3" : "h-4 w-full" }));
          return h("div", { className: "flex flex-col gap-2", style: { width } }, ...rows);
        }
        case "card":
          return h(
            "div",
            { className: "flex flex-col gap-3", style: { width } },
            h("Skeleton", { className: "h-32 w-full rounded-lg" }),
            h("Skeleton", { className: "h-4 w-3/4" }),
            h("Skeleton", { className: "h-4 w-1/2" }),
          );
        case "block":
          return h("Skeleton", { className: "w-full", style: { width, height: Math.round(p.n("height")) } });
        default:
          return h(
            "div",
            { className: "flex items-center gap-4", style: { width } },
            h("Skeleton", { className: "size-12 shrink-0 rounded-full" }),
            h("div", { className: "flex flex-1 flex-col gap-2" }, h("Skeleton", { className: "h-4 w-full" }), h("Skeleton", { className: "h-4 w-3/4" })),
          );
      }
    },
  },
  {
    slug: "sonner",
    name: "Snackbar",
    category: "Communication",
    icon: "chat_bubble",
    role: "floatingBottom",
    w: 120,
    h: 40,
    props: [
      { key: "label", label: "Button label", kind: "text", default: "Show snackbar" },
      { key: "variant", label: "Button variant", kind: "enum", default: "tonal", options: BUTTON_VARIANTS },
      { key: "message", label: "Message", kind: "text", default: "Message sent" },
      { key: "action", label: "Action label", kind: "text", default: "" },
      { key: "closeButton", label: "Close button", kind: "bool", default: false },
    ],
    // the snackbar `toast()` puts on screen, left up inside its box
    open: { box: () => ({ w: 360, h: 88, ay: "end" }) },
    view: (p) => h("SnackbarPreview", { message: p.s("message"), action: p.s("action") || undefined, closeButton: p.b("closeButton") || undefined }),
    tree: (p) => {
      const options: string[] = [];
      if (p.s("action")) options.push(`action: { label: ${JSON.stringify(p.s("action"))}, onClick: () => {} }`);
      if (p.b("closeButton")) options.push("closeButton: true");
      const call = `toast(${JSON.stringify(p.s("message"))}${options.length ? `, { ${options.join(", ")} }` : ""})`;
      return h("Button", { variant: p.s("variant"), onClick: raw(`() => ${call}`, "toast") }, p.s("label"));
    },
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "Communication",
    icon: "chat",
    w: 96,
    h: 40,
    props: [
      { key: "label", label: "Trigger label", kind: "text", default: "Hover me" },
      { key: "variant", label: "Trigger variant", kind: "enum", default: "outlined", options: BUTTON_VARIANTS },
      { key: "text", label: "Tooltip text", kind: "text", default: "Add to library" },
      { key: "side", label: "Side", kind: "enum", default: "top", options: ["top", "right", "bottom", "left"] },
    ],
    open: { box: (p) => around(p.s("side"), 150, 40, 120, 40) },
    tree: (p) =>
      h(
        "Tooltip",
        null,
        h("TooltipTrigger", { render: h("Button", { variant: p.s("variant") }) }, p.s("label")),
        h("TooltipContent", { side: p.s("side") === "top" ? undefined : p.s("side") }, p.s("text")),
      ),
  },
  {
    slug: "alert",
    name: "Alert",
    category: "Communication",
    icon: "warning",
    role: "listLike",
    appearance: { radius: 16 },
    w: 360,
    h: 72,
    props: [
      { key: "variant", label: "Variant", kind: "enum", default: "default", options: ["default", "info", "tertiary", "destructive"] },
      { key: "icon", label: "Icon", kind: "icon", default: "info" },
      { key: "title", label: "Title", kind: "text", default: "Heads up" },
      { key: "description", label: "Description", kind: "text", default: "You can change this in settings.", multiline: true },
      { key: "width", label: "Width", kind: "number", default: 360, min: 200, max: 640, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h(
        "Alert",
        { variant: p.s("variant") === "default" ? undefined : p.s("variant"), style: { width: Math.round(p.n("width")) } },
        p.s("icon") && ic(p.s("icon")),
        p.s("title") && h("AlertTitle", null, p.s("title")),
        p.s("description") && h("AlertDescription", null, p.s("description")),
      ),
  },
];
