import { partBySlug, reader } from "../parts/registry";
import type { UIKey } from "./i18n";
import {
  BUTTON_SIZES,
  CHIP_SIZES,
  CONTENT_W,
  Item,
  PHONE_W,
  PROGRESS_DEFAULT_VALUE,
  SLIDER_DEFAULT_VALUE,
  STATUS_BAR_H,
  TOP_BAR_SIZES,
  buttonHeightOf,
  carouselCardsOf,
  carouselCountOf,
  carouselLayoutOf,
  chipHeightOf,
  dateLayoutOf,
  timeLayoutOf,
} from "./tokens";

/* A sketch made before the parts were the real shadcn M3E components holds the old, hand-drawn
 * kinds. This turns one of them into the component that stands for it. Nothing is deleted: the
 * old item is kept whole in `legacy`, so `revertPatch` can bring it back. A setting the new part
 * has no place for is named in `lost`, for the author to see before the change is made. */

/** what the conversion cannot carry over, one key per kind of loss (each has its own text in the panel) */
export type LostKey = "fill" | "corners" | "iconFill" | "toggleLook" | "slideImages" | "unchecked" | "tap" | "leadingIcon";

/** the panel's text for each loss */
export const LOST_TEXT: Record<LostKey, UIKey> = {
  fill: "lostFill",
  corners: "lostCorners",
  iconFill: "lostIconFill",
  toggleLook: "lostToggle",
  slideImages: "lostSlides",
  unchecked: "lostUnchecked",
  tap: "lostTap",
  leadingIcon: "lostLeadingIcon",
};

export type Migration = {
  /** what to apply to the item: the new component, its props, and every old field cleared */
  patch: Partial<Item>;
  lost: LostKey[];
  /** how far the part moves down to stay where it looked to be (the status bar a top bar no longer draws) */
  dy: number;
};

/** the kinds with no component to become: boxes and text are layout, a picture/camera/map is a stand-in, a bottom sheet is part of a screen */
const NO_COMPONENT = new Set<string>(["box", "text", "image", "camera", "map", "bottomSheet", "component"]);

/** the part has a counterpart the item can turn into */
export const canMigrate = (it: Item) => !NO_COMPONENT.has(it.kind) && !it.legacy;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const nearest = <T>(list: readonly T[], v: number, at: (x: T) => number): T => list.reduce((best, x) => (Math.abs(at(x) - v) < Math.abs(at(best) - v) ? x : best), list[0]);

/** a number kept inside the bounds the part gives the prop; undefined stays undefined */
function fit(slug: string, key: string, v: number | undefined): number | undefined {
  if (v === undefined || !Number.isFinite(v)) return undefined;
  const d = partBySlug(slug)?.props.find((p) => p.key === key);
  return d?.kind === "number" ? clamp(Math.round(v), d.min, d.max) : Math.round(v);
}

const BUTTON_KEY: Record<string, string> = { xs: "xs", s: "sm", m: "md", l: "lg", xl: "xl" };
const sizeKeyOfHeight = (h: number) => BUTTON_KEY[nearest(BUTTON_SIZES, h, (s) => s.h).key];
const CHIP_KEY: Record<string, string> = { xs: "default", s: "md", m: "lg" };
const FAB_KEY = [{ d: 40, key: "sm" }, { d: 56, key: "default" }, { d: 96, key: "lg" }];
const fabSizeOf = (d: number) => nearest(FAB_KEY, d, (s) => s.d).key;
const FAB_COLOR: Record<string, string> = { filled: "primary", tonal: "primary-container", elevated: "surface" };

/** the (label, icon) rows of a bar, a menu or a tab row */
const rows = (it: Item) => (it.tabs ?? []).map((t) => ({ label: t.label, ...(t.icon ? { icon: t.icon } : {}) }));

type Built = { slug: string; props: Record<string, unknown>; dy?: number; lost?: LostKey[] };

/** the component an item becomes and the values its props take; null for a kind with no counterpart */
function build(it: Item): Built | null {
  const lost: LostKey[] = [];
  const toggle = (props: Record<string, unknown>) => {
    if (!it.toggle) return;
    props.toggle = true;
    props.onIcon = it.toggle.icon ?? "";
    props.onLabel = it.toggle.label ?? "";
    if (it.toggle.variant) lost.push("toggleLook");
  };
  switch (it.kind) {
    case "button": {
      const props: Record<string, unknown> = { label: it.label, icon: it.icon ?? "", variant: it.variant, size: sizeKeyOfHeight(buttonHeightOf(it)) };
      const width = fit("button", "width", it.size);
      if (width && it.label) props.width = width;
      toggle(props);
      return { slug: "button", props, lost };
    }
    case "iconButton": {
      const props: Record<string, unknown> = { label: "", icon: it.icon ?? "favorite", variant: it.variant, size: sizeKeyOfHeight(buttonHeightOf(it)) };
      toggle(props);
      return { slug: "button", props, lost };
    }
    case "fab": {
      const props: Record<string, unknown> = { icon: it.icon ?? "edit", size: fabSizeOf(it.size ?? 56), color: FAB_COLOR[it.variant] ?? "secondary-container" };
      toggle(props);
      return { slug: "fab", props, lost };
    }
    case "extendedFab": {
      const h = it.size2 ?? 56;
      const props: Record<string, unknown> = { icon: it.icon ?? "", label: it.label, size: h >= 96 ? "lg" : h >= 80 ? "md" : "default", color: FAB_COLOR[it.variant] ?? "secondary-container" };
      toggle(props);
      return { slug: "fab", props, lost };
    }
    case "chip": {
      const props: Record<string, unknown> = {
        items: [{ label: it.label, ...(it.icon ? { icon: it.icon } : {}) }],
        kind: it.checked === undefined ? "assist" : "filter",
        variant: it.variant === "elevated" ? "elevated" : "flat",
        size: CHIP_KEY[nearest(CHIP_SIZES, chipHeightOf(it), (s) => s.h).key],
      };
      if (it.checked !== undefined) props.selected = it.checked ? 0 : -1;
      return { slug: "chip", props };
    }
    case "splitButton":
      return { slug: "split-button", props: { label: it.label, icon: it.icon ?? "", variant: it.variant, size: sizeKeyOfHeight(buttonHeightOf(it)), menuItems: rows(it).length ? rows(it) : undefined } };
    case "fabMenu":
      return { slug: "fab-menu", props: { items: rows(it), icon: it.icon && it.icon !== "close" ? it.icon : "add" } };
    case "topAppBar": {
      const h = it.size2 ?? TOP_BAR_SIZES[0].h;
      const width = it.size ?? PHONE_W;
      const props = { title: it.label, leading: it.icon ?? "", trailing: it.icon2 ?? "", size: h >= 152 ? "large" : h >= 112 ? "medium" : "small", width: fit("app-bar", "width", width) };
      if (it.radiusTop || it.radiusBottom) lost.push("corners");
      return { slug: "app-bar", props, lost, dy: width > PHONE_W ? 0 : STATUS_BAR_H };
    }
    case "bottomNav":
      return { slug: "navigation-bar", props: { items: rows(it), selected: it.selected ?? 0, width: fit("navigation-bar", "width", it.size ?? PHONE_W) }, lost: it.radiusTop || it.radiusBottom ? ["corners"] : [] };
    case "navRail":
      return {
        slug: "navigation-rail",
        props: { items: rows(it), selected: it.selected ?? 0, expanded: !!it.railExpanded, modal: !!it.railModal, height: fit("navigation-rail", "height", it.size2) },
        lost: it.radiusTop || it.radiusBottom ? ["corners"] : [],
      };
    case "tabs":
      return { slug: "tabs", props: { items: rows(it), selected: it.selected ?? 0, width: fit("tabs", "width", it.size ?? PHONE_W) } };
    case "toolbar":
      return { slug: "toolbar", props: { kind: "floating", color: it.variant === "filled" ? "vibrant" : "standard", items: rows(it) } };
    case "snackbar":
      return { slug: "sonner", props: { message: it.label, action: it.supporting ?? "" } };
    case "card": {
      const props: Record<string, unknown> = {
        title: it.label,
        description: it.supporting ?? "",
        variant: it.variant === "elevated" ? "elevated" : it.variant === "outlined" ? "outlined" : "filled",
        imagePos: it.noImage ? "none" : (it.imagePos ?? "top"),
        imageIcon: it.icon ?? "image",
        textAlign: it.textAlign ?? "start",
        contentAlign: it.contentAlign ?? "start",
        width: fit("card", "width", it.size ?? CONTENT_W),
        height: fit("card", "height", it.size2),
      };
      if (it.src) props.image = it.src;
      const imageSize = fit("card", "imageSize", it.imageSize);
      if (imageSize) props.imageSize = imageSize;
      return { slug: "card", props };
    }
    case "listItem": {
      const trailing = it.switch ? "switch" : it.icon2 ? "icon" : "none";
      if (it.iconFill) lost.push("iconFill");
      return {
        slug: "item",
        props: { items: [{ label: it.label, ...(it.icon ? { icon: it.icon } : {}) }], description: it.supporting ?? "", trailing, trailingIcon: it.icon2 ?? "chevron_right", checked: !!it.checked, width: fit("item", "width", it.size ?? CONTENT_W) },
        lost,
      };
    }
    case "dialog":
      return { slug: "dialog", props: { style: "basic", icon: it.icon ?? "", title: it.label, description: it.supporting ?? "" } };
    case "textField":
      return { slug: "text-field", props: { label: it.label, supporting: it.supporting ?? "", variant: it.variant === "outlined" ? "outlined" : "filled", leadingIcon: it.icon ?? "", trailingIcon: it.icon2 ?? "", width: fit("text-field", "width", it.size ?? CONTENT_W) } };
    case "select": {
      const items = (it.tabs ?? []).map((t) => ({ label: t.label }));
      return {
        slug: "select",
        props: { label: it.label, supporting: it.supporting ?? "", variant: it.variant === "outlined" ? "outlined" : "filled", items: items.length ? items : undefined, selected: it.selected ?? 0, width: fit("select", "width", it.size ?? CONTENT_W) },
        lost: it.icon ? ["leadingIcon"] : [],
      };
    }
    case "switch":
      return { slug: "switch", props: { label: it.label, checked: !!it.checked, width: fit("switch", "width", it.size) } };
    case "checkbox":
      return { slug: "checkbox", props: { label: it.label, checked: !!it.checked } };
    case "radio":
      return { slug: "radio-group", props: { items: [{ label: it.label }], selected: 0 }, lost: it.checked ? [] : ["unchecked"] };
    case "slider":
      return { slug: "slider", props: { value: Math.round(it.value ?? SLIDER_DEFAULT_VALUE), width: fit("slider", "width", it.size ?? CONTENT_W) } };
    case "divider":
      return { slug: "separator", props: { length: fit("separator", "length", it.size ?? CONTENT_W) } };
    case "linearProgress":
      return {
        slug: "progress",
        props: { value: Math.round(it.value ?? PROGRESS_DEFAULT_VALUE), indeterminate: it.value === undefined, variant: it.wavy ? "wavy" : "flat", thickness: fit("progress", "thickness", it.trackThickness), width: fit("progress", "width", it.size ?? CONTENT_W) },
      };
    case "circularProgress":
      return {
        slug: "circular-progress",
        props: { value: Math.round(it.value ?? PROGRESS_DEFAULT_VALUE), indeterminate: it.value === undefined, variant: it.wavy ? "wavy" : "flat", size: fit("circular-progress", "size", it.size ?? 48), thickness: fit("circular-progress", "thickness", it.trackThickness) },
      };
    case "loadingIndicator":
      return { slug: "loading-indicator", props: { variant: it.contained ? "contained" : "default", size: fit("loading-indicator", "size", it.size ?? 48) } };
    case "carousel": {
      const layout = carouselLayoutOf(it);
      const cards = carouselCardsOf(it).slice(0, carouselCountOf(it));
      if (cards.some((c) => c.src)) lost.push("slideImages");
      return {
        slug: "expressive-carousel",
        props: {
          variant: layout === "multiBrowse" ? "multi-browse" : layout === "fullScreen" ? "full-screen" : layout,
          slides: cards.map((c, i) => ({ label: c.label || `${i + 1}` })),
          width: fit("expressive-carousel", "width", it.size ?? PHONE_W),
          height: fit("expressive-carousel", "height", it.size2),
        },
        lost,
      };
    }
    case "datePicker":
      return { slug: "date-picker", props: { variant: dateLayoutOf(it) === "modal" ? "modal" : "docked", width: fit("date-picker", "width", it.size) } };
    case "timePicker":
      return { slug: "time-picker", props: { mode: timeLayoutOf(it), width: fit("time-picker", "width", it.size) } };
    case "searchBar":
      return { slug: "search", props: { kind: "bar", placeholder: it.label, leading: it.icon ?? "", trailing: it.icon2 ?? "", style: it.variant === "outlined" ? "outlined" : "elevated", width: fit("search", "width", it.size ?? CONTENT_W) } };
    default:
      return null;
  }
}

/** the item as the component it becomes, or null when it has no counterpart (or already is one).
 *  Apply `patch` with the editor's usual item change: it is one step to undo. */
export function migrateLegacy(it: Item): Migration | null {
  if (!canMigrate(it)) return null;
  const built = build(it);
  const def = built && partBySlug(built.slug);
  if (!built || !def) return null;
  const lost = new Set<LostKey>(built.lost);
  /* what a part may be painted with is carried; what it cannot take is named */
  const look = def.appearance ? { fill: it.fill, textColor: it.textColor, corners: it.corners } : {};
  if (!def.appearance && it.fill) lost.add("fill");
  if (!def.appearance && it.corners && it.kind !== "box") lost.add("corners");
  const props = Object.fromEntries(Object.entries(built.props).filter(([, v]) => v !== undefined));
  /* a tap goes where the new part has a place for it: a search bar has only its trailing icon, and it is `icon`, not `icon2` */
  const remap: Record<string, string | null> = it.kind === "searchBar" ? { icon2: "icon", icon: null } : {};
  const keys = new Set(def.slots?.(reader(def, props)).map((s) => s.key));
  const actions: Record<string, NonNullable<Item["actions"]>[string]> = {};
  for (const [k, a] of Object.entries(it.actions ?? {})) {
    const to = k in remap ? remap[k] : k;
    if (to && keys.has(to)) actions[to] = a;
    else lost.add("tap");
  }
  /* every field of the old item is cleared first, so nothing of the old drawing is left to apply to the new one */
  const cleared = Object.fromEntries(Object.keys(it).map((k) => [k, undefined]));
  const patch = {
    ...cleared,
    id: it.id,
    kind: "component",
    label: def.name,
    icon: null,
    variant: it.variant,
    component: built.slug,
    props,
    legacy: it,
    ...look,
    ...(it.action ? { action: it.action } : {}),
    ...(Object.keys(actions).length ? { actions } : {}),
    ...(it.note ? { note: it.note } : {}),
    ...(it.noteHistory ? { noteHistory: it.noteHistory } : {}),
  } as Partial<Item>;
  return { patch, lost: [...lost], dy: built.dy ?? 0 };
}

/** the old item an item was converted from, as the change that puts it back, and how far the part
 *  moves back up; null when it never was converted */
export function revertPatch(it: Item): { patch: Partial<Item>; dy: number } | null {
  if (it.kind !== "component" || !it.legacy) return null;
  const cleared = Object.fromEntries(Object.keys(it).map((k) => [k, undefined]));
  return { patch: { ...cleared, ...it.legacy } as Partial<Item>, dy: -(build(it.legacy)?.dy ?? 0) };
}
