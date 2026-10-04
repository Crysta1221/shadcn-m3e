import type { PNode, PValue } from "./node";

/** a choice of an `enum` prop: the value the component takes, and what the panel calls it */
export type Choice = string | { value: string; label: string };

/** one row of a `list` prop: a tab, a menu entry, a destination */
export type ListItem = { label: string; icon?: string };

/** One editable prop of a part. The panel builds its controls from these, and `tree` reads the values back. */
export type PropDef = { key: string; label: string } & (
  | { kind: "text"; default: string; multiline?: boolean }
  | { kind: "enum"; default: string; options: Choice[] }
  | { kind: "bool"; default: boolean }
  | { kind: "number"; default: number; min: number; max: number; step?: number; unit?: string }
  /** a Material Symbols name; "" means no icon */
  | { kind: "icon"; default: string }
  /** rows the author adds and removes; `icons` gives each row an icon as well */
  | { kind: "list"; default: ListItem[]; min?: number; max?: number; icons?: boolean }
);

/** the prop values of one part, read by key with the part's own defaults filled in */
export type P = {
  s: (key: string) => string;
  n: (key: string) => number;
  b: (key: string) => boolean;
  list: (key: string) => ListItem[];
};

export type PartDef = {
  /** the docs page of the component: /components/<slug> */
  slug: string;
  /** the name the docs and the palette give it */
  name: string;
  /** one of the docs' categories */
  category: string;
  /** Material Symbols name, for the palette tile */
  icon: string;
  /** the size it takes on the canvas until it has been measured */
  w: number;
  h: number;
  props: PropDef[];
  /** the JSX the part stands for */
  tree: (p: P) => PNode;
  /** what the canvas draws instead of `tree`, for a part whose open look is not `tree` made to start open */
  view?: (p: P) => PNode;
  /** A part that opens something (a dialog, a menu, a popover) is drawn open on the canvas, inside
   *  a box of this size, so it looks the way it does in use. The code it prints is `tree`, closed. */
  open?: {
    box: (p: P) => { w: number; h: number; ax?: "start" | "end" | "center"; ay?: "start" | "end" | "center" };
    /** the trigger is drawn too (a menu hangs off its button) unless this is "hide" (a dialog stands alone) */
    trigger?: "show" | "hide";
    /** props for the overlay's root while it is drawn open, over `defaultOpen` and `modal: false` */
    root?: Record<string, PValue>;
    /** the component to draw in place of another while the part is open (a context menu opens at the pointer, which a drawing has none of) */
    rename?: (type: string) => string;
  };
};

export type PropValues = Record<string, unknown>;

/** the box a popup that opens to one side of its trigger is drawn in, with the trigger placed so the popup has room */
export function around(side: string, popupW: number, popupH: number, triggerW: number, triggerH: number, gap = 8) {
  const across = side === "left" || side === "right";
  const w = across ? triggerW + gap + popupW : Math.max(triggerW, popupW);
  const h = across ? Math.max(triggerH, popupH) : triggerH + gap + popupH;
  /* the trigger sits where the popup has room: popups open centered on it, so across a vertical gap it is centered, and it hugs the side the popup is not on */
  return { w, h, ax: across ? (side === "left" ? ("end" as const) : ("start" as const)) : ("center" as const), ay: across ? ("center" as const) : side === "top" ? ("end" as const) : ("start" as const) };
}
