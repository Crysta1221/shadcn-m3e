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

/** the docs' categories, in the docs' order (the palette lists them the same way) */
export const CATEGORIES = ["Actions", "Selection", "Text inputs", "Communication", "Containment", "Navigation", "Menus", "Pickers", "Content", "Chat", "Theming"] as const;
export type PartCategory = (typeof CATEGORIES)[number];

export const PARTS: PartDef[] = [...actions, ...selection, ...textInputs, ...communication, ...containment, ...navigation, ...menus, ...pickers, ...content, ...chat, ...theming];

const BY_SLUG = new Map(PARTS.map((d) => [d.slug, d]));
export const partBySlug = (slug: string | undefined): PartDef | undefined => (slug ? BY_SLUG.get(slug) : undefined);

/** the values of a prop: the author's, or the part's default when it has none (or the wrong type) */
function read(def: PropDef, values: PropValues | undefined): unknown {
  const v = values?.[def.key];
  switch (def.kind) {
    case "text":
    case "icon":
      return typeof v === "string" ? v : def.default;
    case "enum":
      return typeof v === "string" && def.options.some((o) => (typeof o === "string" ? o : o.value) === v) ? v : def.default;
    case "bool":
      return typeof v === "boolean" ? v : def.default;
    case "number":
      return typeof v === "number" && Number.isFinite(v) ? Math.min(def.max, Math.max(def.min, v)) : def.default;
    case "list":
      return Array.isArray(v) && v.every((x) => typeof x === "object" && x !== null && typeof (x as ListItem).label === "string") ? (v as ListItem[]) : def.default;
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

/** the components that open something: while the part is drawn open they start open, and are not modal */
const OVERLAY_ROOTS = new Set(["Dialog", "AlertDialog", "Sheet", "SideSheet", "Drawer", "Popover", "HoverCard", "Tooltip", "DropdownMenu", "ContextMenu", "Select", "Combobox"]);

const hasTrigger = (n: PNode) => !!n.children?.some((c) => typeof c !== "string" && c.type === "NavigationMenuTrigger");

/** `node` as it is when drawn open; `first` remembers which menu of a bar is the one that is open */
function opened(node: PNode, open: NonNullable<PartDef["open"]>, first: { menu: boolean; nav: boolean }): PNode {
  const props = node.props ?? {};
  switch (true) {
    /* a menubar has one menu open at a time: the first */
    case node.type === "MenubarMenu" && first.menu:
      first.menu = false;
      return { ...node, props: { ...props, defaultOpen: true } };
    /* a navigation menu opens the item named by its `defaultValue` */
    case node.type === "NavigationMenu":
      return { ...node, props: { ...props, defaultValue: "open" } };
    case node.type === "NavigationMenuItem" && hasTrigger(node) && first.nav:
      first.nav = false;
      return { ...node, props: { ...props, value: "open" } };
    case OVERLAY_ROOTS.has(node.type):
      return {
        ...node,
        props: { ...props, defaultOpen: true, modal: false, ...open.root },
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
  return h("Contained", { width: w, height, ax, ay }, mapNodes(renamed, (n) => opened(n, open, first)));
}

/** the default value of every prop */
export const defaultValues = (def: PartDef): PropValues => Object.fromEntries(def.props.map((d) => [d.key, d.default]));
