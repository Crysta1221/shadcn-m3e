import { actions } from "./defs/actions";
import { chat } from "./defs/chat";
import { communication } from "./defs/communication";
import { containment } from "./defs/containment";
import { content } from "./defs/content";
import { menus } from "./defs/menus";
import { navigation } from "./defs/navigation";
import { pickers } from "./defs/pickers";
import { selection } from "./defs/selection";
import { textInputs } from "./defs/text-inputs";
import { theming } from "./defs/theming";
import type { ListItem, P, PartDef, PropDef, PropValues } from "./types";
import { h, mapNodes, type PNode } from "./node";
import { COMMON_TEXT, defaultTextOf, listTextOf } from "./labels";
import { getLang, type Lang } from "../lib/i18n";

/** the docs' categories, in the docs' order (the palette lists them the same way) */
export const CATEGORIES = ["Actions", "Selection", "Text inputs", "Communication", "Containment", "Navigation", "Menus", "Pickers", "Content", "Chat", "Theming"] as const;
export type PartCategory = (typeof CATEGORIES)[number];

export const PARTS: PartDef[] = [...actions, ...selection, ...textInputs, ...communication, ...containment, ...navigation, ...menus, ...pickers, ...content, ...chat, ...theming];

const BY_SLUG = new Map(PARTS.map((d) => [d.slug, d]));
export const partBySlug = (slug: string | undefined): PartDef | undefined => (slug ? BY_SLUG.get(slug) : undefined);

/** the values of a prop: the author's, or the part's default when it has none (or the wrong
 *  type). A default the author never touched is seeded in the editor's language. */
function read(def: PropDef, values: PropValues | undefined): unknown {
  const v = values?.[def.key];
  switch (def.kind) {
    case "text":
      return typeof v === "string" ? v : defaultTextOf(def, getLang());
    case "icon":
      return typeof v === "string" ? v : def.default;
    case "enum":
      return typeof v === "string" && def.options.some((o) => (typeof o === "string" ? o : o.value) === v) ? v : def.default;
    case "bool":
      return typeof v === "boolean" ? v : def.default;
    case "number":
      return typeof v === "number" && Number.isFinite(v) ? Math.min(def.max, Math.max(def.min, v)) : def.default;
    case "list":
      return Array.isArray(v) && v.every((x) => typeof x === "object" && x !== null && typeof (x as ListItem).label === "string")
        ? (v as ListItem[])
        : def.default.map((x) => ({ ...x, label: listTextOf(x.label, getLang()) }));
  }
}

/** a reader over the part's prop values, with the defaults filled in */
export function reader(def: PartDef, values: PropValues | undefined): P {
  const byKey = new Map(def.props.map((d) => [d.key, d]));
  const get = (key: string) => {
    const d = byKey.get(key);
    if (!d) throw new Error(`${def.slug} has no prop "${key}"`);
    return read(d, values);
  };
  return {
    s: (key) => get(key) as string,
    n: (key) => get(key) as number,
    b: (key) => get(key) as boolean,
    list: (key) => get(key) as ListItem[],
  };
}

/** the JSX tree of a part with the given prop values */
export const treeOf = (def: PartDef, values?: PropValues): PNode => def.tree(reader(def, values));

/** the components that open something: while the part is drawn open they are held open (a click on the canvas must not dismiss them), and are not modal */
const OVERLAY_ROOTS = new Set(["Dialog", "AlertDialog", "Sheet", "SideSheet", "Drawer", "Popover", "HoverCard", "Tooltip", "DropdownMenu", "ContextMenu", "Select", "Combobox"]);

const hasTrigger = (n: PNode) => !!n.children?.some((c) => typeof c !== "string" && c.type === "NavigationMenuTrigger");

/** `node` as it is when drawn open; `first` remembers which menu of a bar is the one that is open */
function opened(node: PNode, open: NonNullable<PartDef["open"]>, first: { menu: boolean; nav: boolean }): PNode {
  const props = node.props ?? {};
  switch (true) {
    /* a menubar has one menu open at a time: the first */
    case node.type === "MenubarMenu" && first.menu:
      first.menu = false;
      return { ...node, props: { ...props, open: true } };
    /* a navigation menu opens the item named by its `defaultValue` */
    case node.type === "NavigationMenu":
      return { ...node, props: { ...props, defaultValue: "open" } };
    case node.type === "NavigationMenuItem" && hasTrigger(node) && first.nav:
      first.nav = false;
      return { ...node, props: { ...props, value: "open" } };
    case OVERLAY_ROOTS.has(node.type):
      return {
        ...node,
        props: { ...props, open: true, modal: false, ...open.root },
        children: open.trigger === "hide" ? node.children?.filter((c) => typeof c === "string" || !/Trigger$/.test(c.type)) : node.children,
      };
    default:
      return node;
  }
}

/** What the canvas draws for a part: its tree, and for a part that opens something, that thing
 *  drawn open inside a box (see `PartDef.open`). The code printed is always `treeOf`. */
export function viewOf(def: PartDef, values?: PropValues): PNode {
  const p = reader(def, values);
  const tree = def.view ? def.view(p) : def.tree(p);
  const open = def.open;
  if (!open) return tree;
  const { w, h: height, ax, ay } = open.box(p);
  const first = { menu: true, nav: true };
  const renamed = open.rename ? mapNodes(tree, (n) => ({ ...n, type: open.rename!(n.type) })) : tree;
  return h("Contained", { width: w, height, ax, ay, fit: open.fit || undefined }, mapNodes(renamed, (n) => opened(n, open, first)));
}

/** the default value of every prop */
export const defaultValues = (def: PartDef): PropValues => Object.fromEntries(def.props.map((d) => [d.key, d.default]));

/* -- language ----------------------------------------------------------------- */

/** the seed `label` is a translation of, or itself when it is none of them */
const seedKey = (s: string): string | undefined => Object.keys(COMMON_TEXT).find((k) => k === s || Object.values(COMMON_TEXT[k]).includes(s));

/** a text value that still holds a seed — in any language — becomes the seed of `lang`;
 *  a value the author wrote stays. Same bargain as `translateDefaultText`. */
function translateSeed(value: string, d: Extract<PropDef, { kind: "text" }>, lang: Lang): string {
  if (value === d.default || Object.values(d.defaults ?? {}).includes(value)) return defaultTextOf(d, lang);
  const key = seedKey(value);
  return key ? (COMMON_TEXT[key][lang] ?? key) : value;
}

/** the props of a `component` item re-seeded for a language change (see `translateSnapshot`) */
export function translateComponentProps(component: string | undefined, props: PropValues | undefined, lang: Lang): PropValues | undefined {
  const def = partBySlug(component);
  if (!def || !props) return props;
  let changed = false;
  const next: PropValues = { ...props };
  for (const d of def.props) {
    if (d.kind === "text") {
      const v = next[d.key];
      if (typeof v === "string" && v) {
        const t = translateSeed(v, d, lang);
        if (t !== v) (next[d.key] = t), (changed = true);
      }
    } else if (d.kind === "list") {
      const v = next[d.key];
      if (Array.isArray(v)) {
        const rows = (v as ListItem[]).map((x) => {
          const key = seedKey(x.label);
          const label = key ? (COMMON_TEXT[key][lang] ?? key) : x.label;
          return label !== x.label ? { ...x, label } : x;
        });
        if (rows.some((x, i) => x !== (v as ListItem[])[i])) (next[d.key] = rows), (changed = true);
      }
    }
  }
  return changed ? next : props;
}
