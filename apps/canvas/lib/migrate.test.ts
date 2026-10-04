/**
 * lib/migrate.ts — an old hand-drawn part becomes the shadcn M3E component that stands for it.
 *
 * Locks in:
 *  - every kind with a counterpart converts to a known component whose props are all its own and in bounds
 *  - a box, text, picture, camera, map and bottom sheet have none, and neither does a part already converted
 *  - the old item is kept whole in `legacy`, and reverting gives it back exactly
 *  - what the new part cannot carry is named in `lost`
 *  - a tap goes to the slot that stands for it, and is named in `lost` when there is none
 *  - a fill and corners are carried to a part that can be painted
 *  - the code printed for a converted part is clean
 */
import { beforeAll, describe, expect, it } from "vitest";

import { buildCode } from "./codegen";
import { allKindsDoc } from "./codegen.fixture";
import { setGlobalLang } from "./i18n";
import { canMigrate, migrateLegacy, revertPatch } from "./migrate";
import { Doc, Item, KIND_SPEC, Kind, makeItem } from "./tokens";
import { partBySlug, reader, treeOf } from "../parts/registry";

beforeAll(() => setGlobalLang("en"));

const NONE: Kind[] = ["box", "text", "image", "camera", "map", "bottomSheet", "component"];
const kinds = (Object.keys(KIND_SPEC) as Kind[]).filter((k) => !NONE.includes(k));

/** the item after the editor applies a change: fields set to undefined are gone */
const apply = (item: Item, patch: Partial<Item>): Item => JSON.parse(JSON.stringify({ ...item, ...patch }));
const convert = (item: Item) => {
  const m = migrateLegacy(item)!;
  return { ...m, item: apply(item, m.patch) };
};

describe("migrateLegacy", () => {
  it.each(kinds)("turns a %s into a component whose props are its own and in bounds", (kind) => {
    const { item } = convert({ ...makeItem(kind), id: "i" });
    const def = partBySlug(item.component);
    expect(item.kind).toBe("component");
    expect(def, `${kind} -> ${item.component}`).toBeDefined();
    for (const [key, value] of Object.entries(item.props ?? {})) {
      const d = def!.props.find((p) => p.key === key);
      expect(d, `${kind}: ${item.component} has no prop ${key}`).toBeDefined();
      if (d!.kind === "enum") expect(d!.options.map((o) => (typeof o === "string" ? o : o.value)), `${kind}.${key}`).toContain(value);
      if (d!.kind === "number") {
        expect(value as number, `${kind}.${key}`).toBeGreaterThanOrEqual(d!.min);
        expect(value as number, `${kind}.${key}`).toBeLessThanOrEqual(d!.max);
      }
    }
    expect(() => treeOf(def!, item.props)).not.toThrow();
  });

  it.each(NONE)("has no counterpart for %s", (kind) => {
    expect(migrateLegacy({ ...makeItem(kind === "component" ? "box" : kind), id: "i", ...(kind === "component" ? { kind: "component" as const } : {}) })).toBeNull();
    expect(canMigrate({ ...makeItem(kind === "component" ? "box" : kind), id: "i", ...(kind === "component" ? { kind: "component" as const } : {}) })).toBe(false);
  });

  it("does not convert what was converted already", () => {
    const { item } = convert({ ...makeItem("button"), id: "i" });
    expect(migrateLegacy(item)).toBeNull();
  });

  it("keeps the old item whole and gives it back on revert", () => {
    const old: Item = { ...makeItem("card"), id: "i", src: "https://example.com/a.png", fill: "primaryContainer", note: "n", action: { to: "s2", transition: "slide" } };
    const { item } = convert(old);
    expect(item.legacy).toEqual(old);
    const back = revertPatch(item)!;
    expect(apply(item, back.patch)).toEqual(old);
  });

  it("reads a button's look and measures", () => {
    const { item } = convert({ ...makeItem("button"), id: "i", label: "Save", icon: "check", variant: "tonal", size: 200, size2: 56 });
    expect(item.component).toBe("button");
    expect(item.props).toMatchObject({ label: "Save", icon: "check", variant: "tonal", size: "md", width: 200 });
  });

  it("turns an icon button into an icon-only button, a checkbox-less radio into a lost state", () => {
    const icon = convert({ ...makeItem("iconButton"), id: "i", icon: "favorite" }).item;
    expect(icon.props).toMatchObject({ label: "", icon: "favorite" });
    const radio = convert({ ...makeItem("radio"), id: "i", checked: false });
    expect(radio.item.component).toBe("radio-group");
    expect(radio.lost).toContain("unchecked");
    expect(convert({ ...makeItem("radio"), id: "i", checked: true }).lost).not.toContain("unchecked");
  });

  it("carries a toggle's on-look, and names the part of it that cannot go", () => {
    const m = convert({ ...makeItem("button"), id: "i", toggle: { icon: "check", label: "On", variant: "filled" } });
    expect(m.item.props).toMatchObject({ toggle: true, onIcon: "check", onLabel: "On" });
    expect(m.lost).toContain("toggleLook");
  });

  it("moves a phone's top bar down by the status bar it no longer draws, and puts it back on revert", () => {
    const phone = convert({ ...makeItem("topAppBar"), id: "i" });
    expect(phone.dy).toBe(24);
    expect(revertPatch(phone.item)!.dy).toBe(-24);
    expect(convert({ ...makeItem("topAppBar"), id: "i", size: 900 }).dy).toBe(0);
    expect(convert({ ...makeItem("bottomNav"), id: "i" }).dy).toBe(0);
  });

  it("sends a tap to the slot that stands for it and names the ones that have none", () => {
    const go = { to: "s2", transition: "slide" as const };
    const nav = convert({ ...makeItem("bottomNav"), id: "i", actions: { "tab:1": go } });
    expect(nav.item.actions).toEqual({ "tab:1": go });
    expect(nav.lost).not.toContain("tap");
    const search = convert({ ...makeItem("searchBar"), id: "i", actions: { icon2: go, icon: go } });
    expect(search.item.actions).toEqual({ icon: go });
    expect(search.lost).toContain("tap");
  });

  it("carries a fill and corners to a part that can be painted, and names them when it cannot be", () => {
    const corners = { tl: 8, tr: 8, bl: 8, br: 8 };
    const card = convert({ ...makeItem("card"), id: "i", fill: "tertiaryContainer", corners });
    expect(card.item).toMatchObject({ fill: "tertiaryContainer", corners });
    expect(card.lost).not.toContain("fill");
    const button = convert({ ...makeItem("button"), id: "i", fill: "primary" });
    expect(button.item.fill).toBeUndefined();
    expect(button.lost).toContain("fill");
  });

  it("names a carousel's slide pictures, which a slide has no place for", () => {
    const m = convert({ ...makeItem("carousel"), id: "i", tabs: [{ icon: "", label: "A", src: "https://example.com/1.png" }] });
    expect(m.item.component).toBe("expressive-carousel");
    expect(m.lost).toContain("slideImages");
  });

  it("prints clean code for every converted kind", () => {
    const doc: Doc = allKindsDoc();
    const frame = doc.frames[0];
    for (const kind of kinds) {
      const old = { ...makeItem(kind), id: `i-${kind}` };
      const item = convert(old).item;
      const one: Doc = { ...doc, groups: [{ id: "g", x: 16, y: 100, axis: "x", items: [item] }], frames: [frame] };
      const { code } = buildCode(one, {});
      expect(code, kind).not.toMatch(/undefined|\[object|NaN/);
      expect(code, kind).toContain(`@/components/m3e/`);
    }
  });

  it("keeps a part's measures through the values its props read back", () => {
    const { item } = convert({ ...makeItem("bottomNav"), id: "i", size: 320 });
    const def = partBySlug("navigation-bar")!;
    expect(reader(def, item.props).n("width")).toBe(320);
  });
});
