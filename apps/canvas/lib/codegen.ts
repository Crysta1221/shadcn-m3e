/* Turns a sketch into code: one React component per screen, built from the real
 * shadcn M3E components (https://shadcn-m3e.crystaworld.dev), not a picture of them.
 *
 * Each part kind maps to the component that is closest to it. The layout is the
 * sketch's own: every run of parts is placed absolutely inside a box the size of its
 * screen, so what comes out is a faithful starting point rather than finished,
 * responsive code. Parts that only exist as a picture on the canvas (a map, a camera
 * view, an image) come out as labelled placeholders.
 *
 * The part -> component table follows the docs of shadcn M3E: component names, props
 * and their allowed values are the ones in packages/m3e of that repository. */
import {
  Doc,
  Frame,
  Group,
  Item,
  Kind,
  PHONE_H,
  PHONE_W,
  buttonHeightOf,
  buttonSizeKeyOf,
  carouselCountOf,
  carouselLayoutOf,
  explodeGroup,
  frameOfGroup,
  frameSizeOf,
  groupBounds,
  layoutOf,
  paletteOf,
  sizeOf,
  topBarHeightOf,
  FULL_WIDTH,
  GAP,
  STATUS_BAR_H,
  MENU_TARGET,
  TOP_BAR_SIZES,
  type ColorToken,
  type Variant,
} from "./tokens";

export const REGISTRY_URL = "https://shadcn-m3e.crystaworld.dev/r/{name}.json";

export type CodeResult = {
  /** the TSX source: the imports, then one component per screen */
  code: string;
  /** the command that adds every component the code uses */
  install: string;
};

type Imports = Map<string, Set<string>>;

/** the file a component lives in, in the shadcn M3E registry (also its item name) */
const FILE: Record<string, string> = {
  Icon: "icon",
  Button: "button",
  Fab: "fab",
  ExtendedFab: "fab",
  FabMenu: "fab-menu",
  FabMenuTrigger: "fab-menu",
  FabMenuContent: "fab-menu",
  FabMenuItem: "fab-menu",
  SplitButton: "split-button",
  Chip: "chip",
  FilterChip: "chip",
  AppBar: "app-bar",
  NavigationBar: "navigation",
  NavigationBarItem: "navigation",
  NavigationRail: "navigation",
  NavigationRailItem: "navigation",
  FloatingToolbar: "toolbar",
  Tabs: "tabs",
  TabsList: "tabs",
  TabsTrigger: "tabs",
  SearchBar: "search",
  Card: "card",
  CardHeader: "card",
  CardTitle: "card",
  CardDescription: "card",
  CardContent: "card",
  Item: "item",
  ItemMedia: "item",
  ItemContent: "item",
  ItemTitle: "item",
  ItemDescription: "item",
  ItemActions: "item",
  ItemGroup: "item",
  Dialog: "dialog",
  DialogTrigger: "dialog",
  DialogContent: "dialog",
  DialogHeader: "dialog",
  DialogTitle: "dialog",
  DialogDescription: "dialog",
  DialogFooter: "dialog",
  DialogClose: "dialog",
  toast: "sonner",
  TextField: "text-field",
  Select: "select",
  SelectTrigger: "select",
  SelectValue: "select",
  SelectContent: "select",
  SelectItem: "select",
  Switch: "switch",
  Checkbox: "checkbox",
  RadioGroup: "radio-group",
  RadioGroupItem: "radio-group",
  Label: "label",
  Slider: "slider",
  Separator: "separator",
  Progress: "progress",
  CircularProgress: "circular-progress",
  LoadingIndicator: "loading-indicator",
  ExpressiveCarousel: "expressive-carousel",
  CarouselSlide: "expressive-carousel",
  DatePicker: "date-picker",
  TimePicker: "time-picker",
};

/** a color token as the Tailwind role utility the shadcn M3E styles define */
const role = (t: ColorToken | string) => t.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const str = (s: string) => JSON.stringify(s);
/** text as a JSX child: plain when it can be, an expression when it holds a brace or an angle */
const txt = (s: string) => (/[{}<>]|^\s|\s$/.test(s) ? `{${str(s)}}` : s);
const icon = (name: string | null | undefined, extra = "") => (name ? `<Icon name=${str(name)}${extra} />` : "");
/** an `icon` prop that takes an element, left out when the part has no icon */
const iconProp = (name: string | null | undefined) => (name ? ` icon={${icon(name)}}` : "");

/** the five named button sizes, as the shadcn M3E sizes of a button */
const BUTTON_SIZE = { xs: "xs", s: "sm", m: "md", l: "lg", xl: "xl" } as const;
const ICON_BUTTON_SIZE = { xs: "icon-xs", s: "icon-sm", m: "icon-md", l: "icon-lg", xl: "icon-xl" } as const;

/** the named size nearest to a height */
function nearestSize(h: number): keyof typeof BUTTON_SIZE {
  const steps = [
    ["xs", 32],
    ["s", 40],
    ["m", 56],
    ["l", 96],
    ["xl", 136],
  ] as const;
  const exact = buttonSizeKeyOf(h);
  if (exact) return exact;
  return steps.reduce((best, s) => (Math.abs(s[1] - h) < Math.abs(best[1] - h) ? s : best))[0];
}

const buttonVariant = (v: Variant) => str(v);

class Ctx {
  imports: Imports = new Map();
  /** `<Toaster />` has to be rendered once for a snackbar to show */
  usesToast = false;
  use(...names: string[]) {
    for (const n of names) {
      const file = FILE[n];
      const set = this.imports.get(file) ?? new Set<string>();
      set.add(n);
      this.imports.set(file, set);
    }
  }
}

/** a width the author set, as a class; undefined when the part sizes itself */
const widthClass = (n: number | undefined) => (n ? `w-[${Math.round(n)}px]` : "");
const cls = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** the JSX of one part; `widths` are the measured widths of the parts that size themselves */
function jsx(it: Item, c: Ctx, widths: Record<string, number>): string {
  const label = it.label ?? "";
  const w = (n?: number) => {
    const k = widthClass(n);
    return k ? ` className=${str(k)}` : "";
  };
  switch (it.kind) {
    case "button": {
      const h = buttonHeightOf(it);
      c.use("Button");
      if (!label && it.icon) {
        c.use("Icon");
        return `<Button variant=${buttonVariant(it.variant)} size=${str(ICON_BUTTON_SIZE[nearestSize(h)])} aria-label="Button">${icon(it.icon)}</Button>`;
      }
      if (it.icon) c.use("Icon");
      return `<Button variant=${buttonVariant(it.variant)} size=${str(BUTTON_SIZE[nearestSize(h)])}${w(it.size)}>${icon(it.icon)}${txt(label)}</Button>`;
    }
    case "iconButton": {
      c.use("Button", "Icon");
      return `<Button variant=${buttonVariant(it.variant)} size=${str(ICON_BUTTON_SIZE[nearestSize(it.size ?? 56)])} aria-label=${str(label || it.icon || "Button")}>${icon(it.icon)}</Button>`;
    }
    case "fab":
    case "fabMenu":
    case "extendedFab": {
      const tabs = it.tabs ?? [];
      const color = it.variant === "tonal" ? ` color="secondary-container"` : "";
      if ((it.kind === "fabMenu" || (it.kind === "fab" && it.action?.to === MENU_TARGET)) && tabs.length) {
        c.use("FabMenu", "FabMenuTrigger", "FabMenuContent", "FabMenuItem", "Icon");
        const items = tabs.map((t) => `<FabMenuItem${iconProp(t.icon)}>${txt(t.label)}</FabMenuItem>`).join("");
        return `<FabMenu><FabMenuContent>${items}</FabMenuContent><FabMenuTrigger /></FabMenu>`;
      }
      if (it.kind === "extendedFab") {
        c.use("ExtendedFab", "Icon");
        return `<ExtendedFab${color}${iconProp(it.icon)}>${txt(label)}</ExtendedFab>`;
      }
      c.use("Fab", "Icon");
      const n = it.size ?? 56;
      const size = n <= 40 ? ` size="sm"` : n <= 56 ? "" : n <= 80 ? ` size="md"` : ` size="lg"`;
      return `<Fab${size}${color} aria-label=${str(label || it.icon || "Action")}>${icon(it.icon)}</Fab>`;
    }
    case "splitButton": {
      c.use("SplitButton", "Icon");
      return `<SplitButton variant=${buttonVariant(it.variant)} size=${str(BUTTON_SIZE[nearestSize(buttonHeightOf(it))])}>${icon(it.icon, " size={20}")}${txt(label)}</SplitButton>`;
    }
    case "chip": {
      const variant = it.variant === "elevated" ? ` variant="elevated"` : "";
      if (it.checked !== undefined) {
        c.use("FilterChip");
        return `<FilterChip${variant}${it.checked ? " defaultPressed" : ""}${it.icon ? ` icon=${str(it.icon)}` : ""}>${txt(label)}</FilterChip>`;
      }
      c.use("Chip");
      return `<Chip${variant}${it.icon ? ` icon=${str(it.icon)}` : ""}>${txt(label)}</Chip>`;
    }
    case "topAppBar": {
      c.use("AppBar", "Button", "Icon");
      const h = topBarHeightOf(it);
      const size = h >= TOP_BAR_SIZES[2].h ? "large" : h >= TOP_BAR_SIZES[1].h ? "medium" : "small";
      const slot = (name: string | null | undefined, aria: string) => (name ? `<Button variant="text" size="icon" aria-label=${str(aria)}>${icon(name)}</Button>` : "");
      const lead = slot(it.icon, "Navigate");
      const trail = slot(it.icon2, "Action");
      return `<AppBar size=${str(size)} title=${str(label)}${lead ? ` leading={${lead}}` : ""}${trail ? ` trailing={${trail}}` : ""} />`;
    }
    case "bottomNav":
    case "navRail": {
      const tabs = it.tabs ?? [];
      const sel = it.selected ?? 0;
      if (it.kind === "bottomNav") {
        c.use("NavigationBar", "NavigationBarItem");
        const items = tabs.map((t, i) => `<NavigationBarItem icon=${str(t.icon)} label=${str(t.label)}${i === sel ? " active" : ""} />`);
        return `<NavigationBar>${items.join("")}</NavigationBar>`;
      }
      c.use("NavigationRail", "NavigationRailItem");
      const items = tabs.map((t, i) => `<NavigationRailItem icon=${str(t.icon)} label=${str(t.label)}${i === sel ? " active" : ""} />`);
      return `<NavigationRail${it.railExpanded ? " expanded" : ""}>${items.join("")}</NavigationRail>`;
    }
    case "searchBar":
      c.use("SearchBar", "Icon");
      return `<SearchBar placeholder=${str(label)} leading={${icon(it.icon || "search")}}${it.icon2 ? ` trailing={${icon(it.icon2)}}` : ""} />`;
    case "card": {
      c.use("Card", "CardHeader", "CardTitle");
      const variant = it.variant === "elevated" ? "elevated" : it.variant === "outlined" ? "outlined" : "filled";
      const image = it.noImage ? "" : `<div className=${str(cls("bg-surface-container-highest", it.imageSize ? `h-[${Math.round(it.imageSize)}px]` : "h-40"))} />`;
      const desc = it.supporting ? (c.use("CardDescription"), `<CardDescription>${txt(it.supporting)}</CardDescription>`) : "";
      return `<Card variant=${str(variant)}>${image}<CardHeader><CardTitle>${txt(label)}</CardTitle>${desc}</CardHeader></Card>`;
    }
    case "listItem": {
      c.use("Item", "ItemContent", "ItemTitle");
      const media = it.icon ? (c.use("ItemMedia", "Icon"), `<ItemMedia variant="icon">${icon(it.icon)}</ItemMedia>`) : "";
      const desc = it.supporting ? (c.use("ItemDescription"), `<ItemDescription>${txt(it.supporting)}</ItemDescription>`) : "";
      const sw = it.switch ? (c.use("ItemActions", "Switch"), `<ItemActions><Switch${it.checked ? " defaultChecked" : ""} /></ItemActions>`) : "";
      return `<Item>${media}<ItemContent><ItemTitle>${txt(label)}</ItemTitle>${desc}</ItemContent>${sw}</Item>`;
    }
    case "dialog": {
      c.use("Dialog", "DialogTrigger", "DialogContent", "DialogHeader", "DialogTitle", "DialogFooter", "DialogClose", "Button");
      const desc = it.supporting ? (c.use("DialogDescription"), `<DialogDescription>${txt(it.supporting)}</DialogDescription>`) : "";
      return `<Dialog><DialogTrigger render={<Button variant="tonal" />}>${txt(label || "Open dialog")}</DialogTrigger><DialogContent showCloseButton={false}><DialogHeader><DialogTitle>${txt(label)}</DialogTitle>${desc}</DialogHeader><DialogFooter><DialogClose render={<Button variant="text" />}>Close</DialogClose></DialogFooter></DialogContent></Dialog>`;
    }
    case "snackbar": {
      c.use("Button", "toast");
      c.usesToast = true;
      const action = it.supporting ? `, { action: { label: ${str(it.supporting)}, onClick: () => {} } }` : "";
      return `<Button variant="tonal" onClick={() => toast(${str(label)}${action})}>Show snackbar</Button>`;
    }
    case "textField":
      c.use("TextField");
      return `<TextField variant=${str(it.variant === "filled" ? "filled" : "outlined")} label=${str(label)}${it.supporting ? ` supportingText=${str(it.supporting)}` : ""}${it.icon ? ` leadingIcon={${(c.use("Icon"), icon(it.icon))}}` : ""} />`;
    case "select": {
      c.use("Select", "SelectTrigger", "SelectValue", "SelectContent", "SelectItem");
      const options = (it.tabs ?? []).map((t, i) => ({ value: `option-${i + 1}`, label: t.label }));
      const items = options.map((o) => `<SelectItem value=${str(o.value)}>${txt(o.label)}</SelectItem>`).join("");
      return `<Select defaultValue=${str(options[0]?.value ?? "")} items={${JSON.stringify(options)}}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>${items}</SelectContent></Select>`;
    }
    case "switch":
      c.use("Switch", "Label");
      return `<Label><Switch${it.checked ? " defaultChecked" : ""} />${txt(label)}</Label>`;
    case "checkbox":
      c.use("Checkbox", "Label");
      return `<Label><Checkbox${it.checked ? " defaultChecked" : ""} />${txt(label)}</Label>`;
    case "radio":
      c.use("RadioGroup", "RadioGroupItem", "Label");
      return `<RadioGroup${it.checked ? ` defaultValue="a"` : ""}><Label><RadioGroupItem value="a" />${txt(label)}</Label></RadioGroup>`;
    case "slider":
      c.use("Slider");
      return `<Slider defaultValue={[${Math.round(it.value ?? 50)}]} />`;
    case "text": {
      const n = it.size ?? 16;
      const scale = n >= 45 ? "display-small" : n >= 28 ? "headline-medium" : n >= 22 ? "title-large" : "body-large";
      return `<p className=${str(`text-${scale}${it.bold ? "-emphasized" : ""} text-on-surface`)}>${txt(label)}</p>`;
    }
    case "image":
    case "camera":
    case "map": {
      c.use("Icon");
      const sz = sizeOf(it, widths);
      const glyph = it.kind === "image" ? "image" : it.kind === "camera" ? "photo_camera" : "map";
      return `<div className=${str(`grid w-[${Math.round(sz.w)}px] h-[${Math.round(sz.h)}px] place-items-center rounded-lg bg-surface-container-highest text-on-surface-variant`)}>${icon(glyph, " size={32}")}</div>`;
    }
    case "divider":
      c.use("Separator");
      return `<Separator />`;
    case "loadingIndicator":
      c.use("LoadingIndicator");
      return `<LoadingIndicator${it.contained ? ` variant="contained"` : ""}${it.size ? ` size={${Math.round(it.size)}}` : ""} />`;
    case "linearProgress":
      c.use("Progress");
      return `<Progress value={${it.value === undefined ? "null" : Math.round(it.value)}}${it.wavy ? ` variant="wavy"` : ""} />`;
    case "circularProgress":
      c.use("CircularProgress");
      return `<CircularProgress value={${it.value === undefined ? "null" : Math.round(it.value)}}${it.wavy ? ` variant="wavy"` : ""}${it.size ? ` size={${Math.round(it.size)}}` : ""} />`;
    case "toolbar": {
      c.use("FloatingToolbar", "Button", "Icon");
      const buttons = (it.tabs ?? []).map((t, i) => `<Button variant="text" size="icon" aria-label=${str(t.label || t.icon || `Action ${i + 1}`)}>${icon(t.icon)}</Button>`);
      return `<FloatingToolbar>${buttons.join("")}</FloatingToolbar>`;
    }
    case "tabs": {
      c.use("Tabs", "TabsList", "TabsTrigger");
      const tabs = it.tabs ?? [];
      const triggers = tabs.map((t, i) => `<TabsTrigger value=${str(`tab-${i + 1}`)}>${txt(t.label)}</TabsTrigger>`);
      return `<Tabs defaultValue=${str(`tab-${(it.selected ?? 0) + 1}`)}><TabsList variant="primary">${triggers.join("")}</TabsList></Tabs>`;
    }
    case "carousel": {
      c.use("ExpressiveCarousel", "CarouselSlide");
      const layout = carouselLayoutOf(it);
      const variant = layout === "uncontained" ? "uncontained" : layout === "multiBrowse" ? "multi-browse" : "hero";
      const slides = Array.from({ length: carouselCountOf(it) }, (_, i) => `<CarouselSlide className="bg-primary-container">${(it.tabs?.[i]?.label ?? "") || i + 1}</CarouselSlide>`);
      return `<ExpressiveCarousel variant=${str(variant)}>${slides.join("")}</ExpressiveCarousel>`;
    }
    case "datePicker":
      c.use("DatePicker");
      return `<DatePicker label=${str(label || "Date")} />`;
    case "timePicker":
      c.use("TimePicker");
      return `<TimePicker />`;
    case "box":
    case "bottomSheet": {
      const sz = sizeOf(it, widths);
      const r = it.kind === "bottomSheet" ? `rounded-t-[${it.radiusTop ?? 28}px]` : `rounded-[${it.radiusTop ?? 28}px_${it.radiusTop ?? 28}px_${it.radiusBottom ?? 28}px_${it.radiusBottom ?? 28}px]`;
      return `<div className=${str(`w-[${Math.round(sz.w)}px] h-[${Math.round(sz.h)}px] ${r} bg-${role(it.fill ?? "surfaceContainerHigh")}`)} />`;
    }
    default: {
      const never: never = it.kind;
      return `{/* ${String(never)} */}`;
    }
  }
}

/** parts that are as wide as the box they sit in, so the box needs a width of its own */
const FILLS: Kind[] = ["slider", "divider", "linearProgress", "select", "textField", "tabs", "card", "listItem"];

/** the pieces of a screen, each run placed where the sketch has it */
function screenBody(frame: Frame, runs: Group[], c: Ctx, widths: Record<string, number>): string[] {
  const { h } = frameSizeOf(frame);
  const out: string[] = [];
  for (const run of runs) {
    const first = run.items[0];
    const at = layoutOf(run, widths)[0];
    const top = Math.round(at.y - frame.y);
    const left = Math.round(at.x - frame.x);
    const body = run.items.map((it) => jsx(it, c, widths));
    /* a part that spans the screen keeps to its edges; the bars stay pinned to the top or the bottom */
    if (run.items.length === 1 && FULL_WIDTH.includes(first.kind)) {
      const bar = first.kind === "topAppBar" || first.kind === "bottomNav";
      const bottom = bar && top + sizeOf(first, widths).h > h - 1;
      const pinnedTop = first.kind === "topAppBar" && top <= STATUS_BAR_H;
      const anchor = bottom ? "bottom-0" : pinnedTop ? "top-0" : `top-[${top}px]`;
      out.push(`<div className="absolute inset-x-0 ${anchor}">${body[0]}</div>`);
      continue;
    }
    const pos = `absolute left-[${left}px] top-[${top}px]`;
    const width = run.items.some((it) => FILLS.includes(it.kind)) ? ` w-[${Math.round(sizeOf(first, widths).w)}px]` : "";
    if (body.length === 1) out.push(`<div className=${str(pos + width)}>${body[0]}</div>`);
    else if (run.items.every((it) => it.kind === "listItem")) {
      c.use("ItemGroup");
      out.push(`<div className=${str(pos + width)}><ItemGroup>${body.join("")}</ItemGroup></div>`);
    } else out.push(`<div className=${str(`${pos} flex ${run.axis === "x" ? "flex-row" : "flex-col"} gap-[${GAP}px]`)}>${body.join("")}</div>`);
  }
  return out;
}

/** a component name for a screen: its own name when that is made of letters, else `ScreenN` */
function componentName(name: string, index: number, taken: Set<string>): string {
  const words = name.match(/[A-Za-z0-9]+/g) ?? [];
  let n = words.map((w) => w[0].toUpperCase() + w.slice(1)).join("");
  if (!n || /^\d/.test(n)) n = `Screen${index + 1}`;
  else if (!n.endsWith("Screen")) n += "Screen";
  let out = n;
  for (let i = 2; taken.has(out); i++) out = `${n}${i}`;
  taken.add(out);
  return out;
}

/** The tags and the text between them. A tag ends at the first `>` outside quotes and braces
 *  (an arrow function's `=>` sits inside braces); text ends at the next `<` outside braces. */
function tokenize(s: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < s.length) {
    const tag = s[i] === "<";
    let j = tag ? i + 1 : i;
    let depth = 0;
    let quote = "";
    for (; j < s.length; j++) {
      const ch = s[j];
      if (quote) {
        if (ch === "\\") j++;
        else if (ch === quote) quote = "";
      } else if ((tag || depth > 0) && (ch === '"' || ch === "'" || ch === "`")) quote = ch;
      else if (ch === "{") depth++;
      else if (ch === "}") depth--;
      else if (tag && ch === ">" && depth === 0) break;
      else if (!tag && ch === "<" && depth === 0) {
        j--;
        break;
      }
    }
    out.push(s.slice(i, j + 1));
    i = j + 1;
  }
  return out;
}

/** one element per line, indented by nesting; an element holding only text, or one self-closing child, stays on one line */
function pretty(source: string, depth: number): string {
  const pad = (d: number) => "  ".repeat(d);
  const tokens = tokenize(source);
  const lines: string[] = [];
  let d = depth;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.startsWith("</")) {
      d--;
      lines.push(pad(d) + t);
    } else if (t.startsWith("<")) {
      const self = t.endsWith("/>");
      const next = tokens[i + 1];
      const after = tokens[i + 2];
      const inline = !self && next !== undefined && after?.startsWith("</") && (!next.startsWith("<") || next.endsWith("/>"));
      if (inline) {
        lines.push(pad(d) + t + next + after);
        i += 2;
        continue;
      }
      lines.push(pad(d) + t);
      if (!self) d++;
    } else if (t.trim()) lines.push(pad(d) + t.trim());
  }
  return lines.join("\n");
}

export function buildCode(doc: Doc, widths: Record<string, number>, onlyFrameId?: string): CodeResult {
  const c = new Ctx();
  const palette = paletteOf(doc.paletteKey, doc.customPalette, doc.theme);
  const seed = palette.seed ?? palette.primary;

  /* a sketch with no screens is one open canvas: its parts' own bounds make the screen */
  let frames = doc.frame === "phone" ? doc.frames : [];
  const loose = frames.length === 0;
  if (loose && doc.groups.length) {
    const b = doc.groups.map((g) => groupBounds(g, widths));
    const l = Math.min(...b.map((x) => x.l));
    const t = Math.min(...b.map((x) => x.t));
    const r = Math.max(...b.map((x) => x.r));
    const bt = Math.max(...b.map((x) => x.b));
    frames = [{ id: "canvas", name: doc.title || "Screen", x: l, y: t, w: Math.max(PHONE_W, Math.round(r - l)), h: Math.max(PHONE_H / 2, Math.round(bt - t)) }];
  }
  const shown = onlyFrameId ? frames.filter((f) => f.id === onlyFrameId) : frames;

  const taken = new Set<string>();
  const screens = shown.map((frame, i) => {
    const runs = doc.groups
      .filter((g) => loose || frameOfGroup(g, frames, widths)?.id === frame.id)
      .flatMap((g) => (g.free ? explodeGroup(g, widths) : [g]))
      .sort((a, b) => a.y - b.y || a.x - b.x);
    const { w, h } = frameSizeOf(frame);
    const name = componentName(frame.name, i, taken);
    const body = screenBody(frame, runs, c, widths);
    const bg = frame.bg ? `bg-${role(frame.bg)}` : "bg-surface";
    const open = `<div className=${str(`relative overflow-hidden ${bg} w-[${w}px] h-[${h}px]`)}>`;
    const inner = [open, ...body, "</div>"].join("");
    return `export function ${name}() {\n  return (\n${pretty(inner, 2)}\n  )\n}`;
  });

  const lines: string[] = [];
  const names = [...c.imports.entries()].sort(([a], [b]) => a.localeCompare(b));
  for (const [file, set] of names) lines.push(`import { ${[...set].sort((a, b) => a.localeCompare(b)).join(", ")} } from "@/components/m3e/${file}"`);

  const install = `npx shadcn@latest add @m3e/base ${[...new Set(names.map(([f]) => f))].map((f) => `@m3e/${f}`).join(" ")}`;
  const header = [
    "// Generated by M3E Canvas. Components are shadcn M3E (https://shadcn-m3e.crystaworld.dev).",
    `// 1. Register the registry in components.json:  "registries": { "@m3e": ${str(REGISTRY_URL)} }`,
    `// 2. ${install}`,
    `// 3. Wrap your app once:  <M3eProvider theme={{ defaultTheme: { source: { primary: ${str(seed)} } } }}>…</M3eProvider>`,
    ...(c.usesToast ? ["// 4. Render <Toaster /> (from @/components/m3e/sonner) once, so snackbars show."] : []),
  ];
  const code = [...header, "", ...lines, ...(lines.length ? [""] : []), screens.join("\n\n"), ""].join("\n");
  return { code, install };
}
