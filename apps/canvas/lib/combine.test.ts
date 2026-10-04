/**
 * lib/combine.ts — neighbouring Button parts become one button group.
 *
 * Locks in:
 *  - two or more buttons side by side join into one `button-group`, in reading order
 *  - the group keeps each label, icon and tap, and its look is the one most buttons share
 *  - a button that differs from the rest keeps its own variant as a row of the group
 *  - buttons stacked on top of each other join as a vertical group
 *  - far-apart, differently sized, toggle, locked, free and legacy buttons stay as they are
 *  - a part between two buttons keeps them apart
 */
import { beforeAll, describe, expect, it } from "vitest";

import { combineButtons } from "./combine";
import { setGlobalLang } from "./i18n";
import { Frame, Group, Item, makeItem } from "./tokens";

beforeAll(() => setGlobalLang("en"));

const frame: Frame = { id: "f", name: "Home", x: 0, y: 0 };
/** every button is 96 x 40 until it is measured */
const widths: Record<string, number> = {};

const button = (id: string, props: Record<string, unknown> = {}, patch: Partial<Item> = {}): Item => ({ ...makeItem("component", "button"), id, props, ...patch });
const at = (id: string, x: number, y: number, it: Item, extra: Partial<Group> = {}): Group => ({ id, x, y, axis: "x", items: [it], ...extra });

describe("combineButtons", () => {
  it("joins buttons side by side into one button group, in reading order", () => {
    const groups = [at("g2", 120, 100, button("b", { label: "Two" })), at("g1", 16, 100, button("a", { label: "One", icon: "star" }))];
    const out = combineButtons(groups, frame, [frame], widths)!;
    expect(out).toHaveLength(1);
    const it = out[0].items[0];
    expect(it.component).toBe("button-group");
    expect(it.props?.items).toEqual([{ label: "One", icon: "star" }, { label: "Two" }]);
    expect(out[0]).toMatchObject({ id: "g1", x: 16, y: 100 });
  });

  it("keeps the taps and the notes, one slot per button", () => {
    const go = { to: "s2", transition: "slide" as const };
    const groups = [at("g1", 16, 100, button("a", {}, { action: go, note: "first" })), at("g2", 120, 100, button("b", {}, { note: "second" }))];
    const it = combineButtons(groups, frame, [frame], widths)![0].items[0];
    expect(it.actions).toEqual({ "tab:0": go });
    expect(it.note).toBe("first\nsecond");
  });

  it("makes the look most buttons share the group's and keeps the odd one's as its own", () => {
    const groups = [
      at("g1", 16, 100, button("a", { variant: "tonal" })),
      at("g2", 120, 100, button("b", { variant: "tonal" })),
      at("g3", 224, 100, button("c", { variant: "outlined" })),
    ];
    const it = combineButtons(groups, frame, [frame], widths)![0].items[0];
    expect(it.props?.buttonVariant).toBe("tonal");
    expect(it.props?.items).toEqual([{ label: "Button" }, { label: "Button" }, { label: "Button", variant: "outlined" }]);
  });

  it("joins buttons stacked on top of each other into a vertical group", () => {
    const groups = [at("g1", 16, 100, button("a")), at("g2", 16, 150, button("b"))];
    const it = combineButtons(groups, frame, [frame], widths)![0].items[0];
    expect(it.props?.orientation).toBe("vertical");
  });

  it("leaves distant, differently sized, toggle, locked, free and legacy buttons alone", () => {
    const far = [at("g1", 16, 100, button("a")), at("g2", 300, 100, button("b"))];
    expect(combineButtons(far, frame, [frame], widths)).toBeNull();
    const sizes = [at("g1", 16, 100, button("a", { size: "sm" })), at("g2", 120, 100, button("b", { size: "md" }))];
    expect(combineButtons(sizes, frame, [frame], widths)).toBeNull();
    const toggle = [at("g1", 16, 100, button("a", { toggle: true })), at("g2", 120, 100, button("b"))];
    expect(combineButtons(toggle, frame, [frame], widths)).toBeNull();
    const locked = [at("g1", 16, 100, button("a"), { locked: true }), at("g2", 120, 100, button("b"))];
    expect(combineButtons(locked, frame, [frame], widths)).toBeNull();
    const free = [at("g1", 16, 100, button("a"), { free: true }), at("g2", 120, 100, button("b"))];
    expect(combineButtons(free, frame, [frame], widths)).toBeNull();
    const legacy = [at("g1", 16, 100, makeItem("button")), at("g2", 120, 100, makeItem("button"))];
    expect(combineButtons(legacy, frame, [frame], widths)).toBeNull();
  });

  it("does not reach across a part that stands between two buttons", () => {
    const groups = [at("g1", 16, 100, button("a")), at("g3", 114, 100, makeItem("divider")), at("g2", 120, 100, button("b"))];
    expect(combineButtons(groups, frame, [frame], widths)).toBeNull();
  });

  it("does not change the document it was given", () => {
    const groups = [at("g1", 16, 100, button("a")), at("g2", 120, 100, button("b"))];
    const before = JSON.stringify(groups);
    combineButtons(groups, frame, [frame], widths);
    expect(JSON.stringify(groups)).toBe(before);
  });
});
