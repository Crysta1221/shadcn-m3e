import { h, ic, type PNode } from "../node";
import type { ListItem, PartDef } from "../types";

const ITEMS: ListItem[] = [
  { label: "Preview", icon: "visibility" },
  { label: "Share", icon: "share" },
  { label: "Rename", icon: "edit" },
];

/** an item row: its icon (when it has one) and its label, marked so a tap on it can be told apart */
const rows = (items: ListItem[], item: string): PNode[] => items.map((it, i) => h(item, { "data-tap": `tab:${i}` }, it.icon ? ic(it.icon) : null, it.label));

/** every item of a menu is a place a tap can be sent from */
const menuSlots = (items: ListItem[]) => items.map((it, i) => ({ key: `tab:${i}`, label: it.label || `${i + 1}`, icon: it.icon }));

export const menus: PartDef[] = [
  {
    slug: "dropdown-menu",
    name: "Dropdown menu",
    category: "Menus",
    icon: "arrow_drop_down",
    w: 120,
    h: 40,
    props: [
      { key: "label", label: "Trigger label", kind: "text", default: "Open menu" },
      { key: "variant", label: "Trigger variant", kind: "enum", default: "outlined", options: ["filled", "tonal", "elevated", "outlined", "text"] },
      { key: "items", label: "Items", kind: "list", default: ITEMS, min: 1, max: 8, icons: true },
      { key: "destructive", label: "Destructive item", kind: "text", default: "Delete" },
    ],
    // the canvas draws the closed menu (the trigger); the content is part of the code
    open: { box: (p) => ({ w: 260, h: 40 + 8 + (p.list("items").length + (p.s("destructive") ? 1 : 0)) * 44 + 28 }) },
    slots: (p) => [...menuSlots(p.list("items")), ...(p.s("destructive") ? [{ key: `tab:${p.list("items").length}`, label: p.s("destructive"), icon: "delete" }] : [])],
    tree: (p) =>
      h(
        "DropdownMenu",
        null,
        h("DropdownMenuTrigger", { render: h("Button", { variant: p.s("variant") }) }, p.s("label")),
        h(
          "DropdownMenuContent",
          { className: "w-56" },
          ...rows(p.list("items"), "DropdownMenuItem"),
          p.s("destructive") ? h("DropdownMenuSeparator") : null,
          p.s("destructive") ? h("DropdownMenuItem", { variant: "destructive", "data-tap": `tab:${p.list("items").length}` }, ic("delete"), p.s("destructive")) : null,
        ),
      ),
  },
  {
    slug: "context-menu",
    name: "Context menu",
    category: "Menus",
    icon: "ads_click",
    w: 256,
    h: 128,
    props: [
      { key: "label", label: "Area text", kind: "text", default: "Right click here" },
      {
        key: "items",
        label: "Items",
        kind: "list",
        default: [
          { label: "Back", icon: "arrow_back" },
          { label: "Forward", icon: "arrow_forward" },
          { label: "Reload", icon: "refresh" },
        ],
        min: 1,
        max: 8,
        icons: true,
      },
      { key: "width", label: "Width", kind: "number", default: 256, min: 120, max: 640, step: 4, unit: "px" },
      { key: "height", label: "Height", kind: "number", default: 128, min: 64, max: 480, step: 4, unit: "px" },
    ],
    open: { box: (p) => ({ w: Math.max(p.n("width"), 200), h: p.n("height") + 8 + p.list("items").length * 44 + 16 }), rename: (type) => type.replace(/^ContextMenu/, "DropdownMenu") },
    slots: (p) => menuSlots(p.list("items")),
    tree: (p) =>
      h(
        "ContextMenu",
        null,
        h(
          "ContextMenuTrigger",
          {
            className: "flex items-center justify-center rounded-lg border border-dashed border-outline text-body-medium text-on-surface-variant",
            style: { width: Math.round(p.n("width")), height: Math.round(p.n("height")) },
          },
          p.s("label"),
        ),
        h("ContextMenuContent", { className: "w-48" }, ...rows(p.list("items"), "ContextMenuItem")),
      ),
  },
  {
    slug: "menubar",
    name: "Menubar",
    category: "Menus",
    icon: "menu",
    w: 220,
    h: 48,
    props: [
      { key: "menus", label: "Menus", kind: "list", default: [{ label: "File" }, { label: "Edit" }, { label: "View" }], min: 1, max: 6 },
      {
        key: "items",
        label: "Items in each menu",
        kind: "list",
        default: [
          { label: "New tab", icon: "tab" },
          { label: "New window", icon: "open_in_new" },
          { label: "Print", icon: "print" },
        ],
        min: 1,
        max: 8,
        icons: true,
      },
    ],
    open: { box: (p) => ({ w: Math.max(260, p.list("menus").length * 90), h: 48 + 8 + p.list("items").length * 44 + 16 }) },
    slots: (p) => menuSlots(p.list("items")),
    tree: (p) =>
      h(
        "Menubar",
        null,
        ...p.list("menus").map((m) => h("MenubarMenu", null, h("MenubarTrigger", null, m.label), h("MenubarContent", null, ...rows(p.list("items"), "MenubarItem")))),
      ),
  },
];
