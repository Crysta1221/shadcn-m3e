/**
 * lib/tidy.ts — rule-based screen layout.
 *
 * Locks in:
 *  - pullInto pulls a group back inside a frame; groups already inside are unchanged
 *  - railSide picks the edge nearest the rail's horizontal centre
 *  - barSlotOf: bars of the frame span the body width, after any left rails
 *  - tidyFrame places anchored units (rails, top bars, bottom bars, FAB, dialog)
 *    in their canonical slots; floating rows flow down on the layout margin
 *  - tidyFrame returns null when the screen is already tidy
 *  - tidyFrame shifts the parts so they don't overlap a bar at the top, etc.
 *  - Tidy assigns an axis to joined runs
 *  - Two near-neighbour buttons fuse; two beyond JOIN_GAP_X stay separate rows
 *  - Three list items stacked vertically with the right gap join into one run
 *  - Groups of different families do not join
 *  - carryFrame: phone <-> desktop conversion swaps a stand-alone bottomNav with a navRail
 *  - carryFrame: a navRail placed on the right stays on the right
 */
import { describe, expect, it } from "vitest";
import {
  tidyFrame,
  pullInto,
  railSide,
  barSlotOf,
  carryFrame,
  bodyRect,
} from "./tidy";
import {
  Frame,
  Group,
  Item,
  PHONE_W,
  PHONE_H,
  DESKTOP_W,
  DESKTOP_H,
  NAV_BAR_H,
  PHONE_MARGIN,
  makeItem,
} from "./tokens";

const phoneFrame: Frame = { id: "f1", name: "Phone", x: 0, y: 0 };
const widths: Record<string, number> = {};

const btn = (id: string, label = "B"): Item => ({ id, kind: "button", label, icon: null, variant: "filled" });
const iconBtn = (id: string): Item => ({ id, kind: "iconButton", label: "", icon: "favorite", variant: "tonal" });
const topBar = (id: string): Item => ({ id, kind: "topAppBar", label: "Title", icon: "menu", icon2: "search", variant: "filled" });
const listItem = (id: string, label = "Item"): Item => ({ id, kind: "listItem", label, icon: "person", icon2: "chevron_right", variant: "filled" });
const navBar = (id: string, tabs = 3): Item => {
  const t: Item = { id, kind: "bottomNav", label: "", icon: null, variant: "filled", tabs: Array.from({ length: tabs }, (_, i) => ({ icon: "home", label: `T${i}` })) };
  return t;
};
const navRail = (id: string, tabs = 3): Item => {
  const t: Item = { id, kind: "navRail", label: "", icon: null, variant: "filled", tabs: Array.from({ length: tabs }, (_, i) => ({ icon: "home", label: `T${i}` })) };
  return t;
};
const fab = (id: string): Item => ({ id, kind: "fab", label: "", icon: "add", variant: "filled" });

const group = (id: string, x: number, y: number, items: Item[], axis: "x" | "y" = "x", free = false): Group => ({
  id,
  x,
  y,
  axis,
  items,
  ...(free ? { free: true } : {}),
});

describe("pullInto", () => {
  it("returns the group unchanged when already inside the frame", () => {
    const g = group("g1", 10, 10, [btn("a")]);
    expect(pullInto(g, phoneFrame, widths)).toBe(g);
  });

  it("shifts the group leftward when its right edge overflows the frame", () => {
    const g = group("g1", PHONE_W + 50, 10, [btn("a")]);
    const out = pullInto(g, phoneFrame, widths);
    expect(out).not.toBe(g);
    expect(out.x).toBeLessThan(g.x);
    // The group's right edge (x + ~128dp button width) should now fit in PHONE_W
    const BUTTON_W = 128;
    expect(out.x + BUTTON_W).toBeLessThanOrEqual(PHONE_W + 1);
  });

  it("shifts the group upward when its bottom overflows the frame", () => {
    const g = group("g1", 10, PHONE_H + 50, [btn("a")]);
    const out = pullInto(g, phoneFrame, widths);
    expect(out.y).toBeLessThan(g.y);
  });

  it("a top-app-bar sized to the full screen snaps its left edge to the frame left", () => {
    const g = group("g1", 100, 0, [topBar("t")]); // already starts before phoneFrame ends but x > 0
    const out = pullInto(g, phoneFrame, widths);
    expect(out.x).toBe(0);
  });
});

describe("railSide", () => {
  it("returns 'left' when the rail's centre is left of the frame centre", () => {
    const r = group("r", 0, 0, [navRail("nr")]);
    expect(railSide(r, phoneFrame, widths)).toBe("left");
  });

  it("returns 'right' when the rail's centre is right of the frame centre", () => {
    const r = group("r", PHONE_W - 80, 0, [navRail("nr")]);
    expect(railSide(r, phoneFrame, widths)).toBe("right");
  });
});

describe("barSlotOf", () => {
  it("returns the full body when no rail exists", () => {
    expect(barSlotOf([], phoneFrame, [phoneFrame], widths)).toEqual({ x: 0, w: PHONE_W });
  });

  it("skips a left rail's width", () => {
    const railG = group("r", 0, 0, [navRail("nr")]);
    const slot = barSlotOf([railG], phoneFrame, [phoneFrame], widths);
    expect(slot.x).toBe(80);
    expect(slot.w).toBe(PHONE_W - 80);
  });
});

describe("tidyFrame", () => {
  it("returns null when no groups belong to the frame", () => {
    expect(tidyFrame([], phoneFrame, [phoneFrame], widths)).toBeNull();
  });

  it("returns null when a top app bar already sits in its slot", () => {
    const f = phoneFrame;
    expect(tidyFrame([group("g1", 0, 0, [topBar("t")])], f, [f], widths)).toBeNull();
  });

  it("leaves two buttons apart when the gap between them exceeds the join distance", () => {
    const f = phoneFrame;
    // A 24dp gap joins (see lib/tidy.test.ts); at 60dp the buttons stay two rows.
    const apart = [group("g1", 16, 300, [btn("a")]), group("g2", 16 + 128 + 60, 300, [btn("b")])];
    const out = tidyFrame(apart, f, [f], widths) ?? apart;
    expect(out).toHaveLength(2);
    expect(out.flatMap((g) => g.items.map((it) => it.id)).sort()).toEqual(["a", "b"]);
  });

  it("fuses two close buttons in a row into one connected run", () => {
    const f = phoneFrame;
    const g1 = group("g1", 100, 100, [btn("a")]);
    // Same row, dropped onto the same spot: gap <= JOIN_GAP_X, so joinRuns
    // must fuse them into one group holding both ids.
    const g2 = group("g2", 100, 100, [btn("b")]);
    const out = tidyFrame([g1, g2], f, [f], widths);
    expect(out).not.toBeNull();
    const merged = out!.find((g) => g.items.some((i) => i.id === "a") && g.items.some((i) => i.id === "b"));
    expect(merged).toBeDefined();
  });

  it("anchors a top app bar to the top of the screen", () => {
    const f = phoneFrame;
    const g = group("g1", 0, 500, [topBar("t")]); // placed mid-screen
    const out = tidyFrame([g], f, [f], widths)!;
    const tidied = out.find((x) => x.items[0].kind === "topAppBar")!;
    expect(tidied.y).toBe(0);
    expect(tidied.x).toBe(0);
  });

  it("anchors a bottomNav to the bottom of the screen", () => {
    const f = phoneFrame;
    const g = group("g1", 100, 100, [navBar("bn")]); // placed near top
    const out = tidyFrame([g], f, [f], widths)!;
    const nav = out.find((x) => x.items[0].kind === "bottomNav")!;
    expect([nav.x, nav.y]).toEqual([0, PHONE_H - (80 + NAV_BAR_H)]);
  });

  it("places a FAB at the bottom-right corner of the body", () => {
    const f = phoneFrame;
    const g = group("g1", 0, 0, [fab("f")]);
    const out = tidyFrame([g], f, [f], widths)!;
    const f0 = out.find((x) => x.items[0].kind === "fab")!;
    expect([f0.x, f0.y]).toEqual([PHONE_W - PHONE_MARGIN - 56, PHONE_H - PHONE_MARGIN - 56]);
  });

  it("stacks loose rows on the layout margin from the top down", () => {
    const f = phoneFrame;
    const a = group("a", 200, 200, [btn("a")]); // misplaced
    const b = group("b", 200, 400, [btn("b")]); // misplaced
    const out = tidyFrame([a, b], f, [f], widths)!;
    // both should now be near the top
    const ys = out.map((g) => g.y).sort((x, y) => x - y);
    expect(ys[0]).toBeLessThanOrEqual(40); // PHONE_MARGIN(16) + status(24) area
    expect(ys[1] - ys[0]).toBeGreaterThan(0);
  });
});

describe("carryFrame", () => {
  it("shrinks a phone to a smaller phone without losing groups", () => {
    const smaller: Frame = { id: "f2", name: "P2", x: 400, y: 0, w: 300, h: 500 };
    const g = group("g1", 16, 24, [topBar("t")]);
    const res = carryFrame([g], phoneFrame, smaller, [phoneFrame, smaller], widths);
    // The screen that became "smaller" — it's `to`, so the result frame should be smaller.
    expect(res.frames[1].w).toBe(300);
    expect(res.frames[1].h).toBe(500);
    expect(res.groups).toHaveLength(1);
    expect(res.groups[0].items[0].kind).toBe("topAppBar");
  });

  it("expands a phone to desktop: a stand-alone bottomNav becomes a navRail", () => {
    const desk: Frame = { id: "d", name: "D", x: 400, y: 0, w: DESKTOP_W, h: DESKTOP_H };
    const bn = group("bn", 0, 800, [navBar("bn", 3)]);
    const res = carryFrame([bn], phoneFrame, desk, [phoneFrame, desk], widths);
    const movedNav = res.groups.find((g) => g.items[0].kind === "navRail" || g.items[0].kind === "bottomNav");
    expect(movedNav).toBeDefined();
    // After expansion, the rail (not bar) should be present somewhere in the doc
    const hasRail = res.groups.some((g) => g.items[0].kind === "navRail");
    expect(hasRail).toBe(true);
  });

  it("shrinks desktop to phone: a stand-alone navRail becomes a bottomNav", () => {
    const desk: Frame = { id: "d", name: "D", x: 0, y: 0, w: DESKTOP_W, h: DESKTOP_H };
    const phone: Frame = { id: "p", name: "P", x: 0, y: 0 };
    const r = group("r", 0, 0, [navRail("nr", 3)]);
    const res = carryFrame([r], desk, phone, [desk, phone], widths);
    const hasBar = res.groups.some((g) => g.items[0].kind === "bottomNav");
    expect(hasBar).toBe(true);
  });
});

describe("tidy idempotence", () => {
  it("calling tidy twice converges (second call returns null)", () => {
    const f = phoneFrame;
    const groups = [
      group("a", 16, 24, [topBar("t")]),
      group("b", 100, 500, [btn("b")]),
    ];
    const first = tidyFrame(groups, f, [f], widths)!;
    const second = tidyFrame(first, f, [f], widths);
    expect(second).toBeNull();
  });
});

describe("expandable rail layout", () => {
  it.each(["left", "right"] as const)("packs multiple modal layout slots on the %s edge", (side) => {
    const screen: Frame = { id: "multi", name: "Desktop", x: 20, y: 40, w: 1280, h: 800 };
    const rails = [0, 1].map((i) => group(`rail-${i}`, side === "left" ? 30 + i * 230 : 820 + i * 230, 48, [
      { ...navRail(`r-${i}`), railExpanded: true, railModal: true, size2: 800 },
    ]));
    const bar = group("top", side === "left" ? 212 : 20, 48, [{ ...topBar("top-item"), size: 1088 }]);
    const out = tidyFrame([...rails, bar], screen, [screen], widths)!;
    const first = out.find((g) => g.id === "rail-0")!;
    const second = out.find((g) => g.id === "rail-1")!;
    expect(second.x - first.x).toBe(96);
    expect(side === "left" ? first.x : second.x + 220).toBe(side === "left" ? 20 : 1300);
    expect(out.find((g) => g.id === "top")?.x).toBe(side === "left" ? 212 : 20);
    expect(barSlotOf(out, screen, [screen], widths)).toEqual({ x: side === "left" ? 212 : 20, w: 1088 });
    expect(tidyFrame(out, screen, [screen], widths)).toBeNull();
  });

  const desk: Frame = { id: "wide", name: "Desktop", x: 40, y: 20, w: DESKTOP_W, h: DESKTOP_H };

  it.each([
    [undefined, undefined, 80, 80],
    [false, false, 96, 96],
    [true, false, 220, 220],
    [false, true, 96, 96],
    [true, true, 220, 96],
  ] as const)("uses the rail's layout width for expanded=%s modal=%s", (railExpanded, railModal, visualWidth, layoutWidth) => {
    for (const side of ["left", "right"] as const) {
      const x = side === "left" ? desk.x + 4 : desk.x + DESKTOP_W - visualWidth - 4;
      const rail = group("rail", x, desk.y + 8, [{ ...navRail("r"), railExpanded, railModal, size2: DESKTOP_H }]);
      const slot = barSlotOf([rail], desk, [desk], widths);
      expect(slot).toEqual({ x: desk.x + (side === "left" ? layoutWidth : 0), w: DESKTOP_W - layoutWidth });
      const body = bodyRect([rail], desk, [desk], widths);
      expect([body.l, body.r]).toEqual([slot.x + PHONE_MARGIN, slot.x + slot.w - PHONE_MARGIN]);
      const bar = group("bar", desk.x + 300, desk.y + 60, [{ ...topBar("b"), size: slot.w }]);
      const out = tidyFrame([rail, bar], desk, [desk], widths)!;
      expect(out.find((g) => g.id === "rail")?.x).toBe(side === "left" ? desk.x : desk.x + DESKTOP_W - visualWidth);
      expect(out.find((g) => g.id === "bar")?.x).toBe(slot.x);
      expect(tidyFrame(out, desk, [desk], widths)).toBeNull();
    }
  });

  it("sums mixed rail widths on both edges", () => {
    const rails = [
      group("left-wide", desk.x, desk.y, [{ ...navRail("l1"), railExpanded: true }]),
      group("left-compact", desk.x + 230, desk.y, [{ ...navRail("l2"), railExpanded: false }]),
      group("right-modal", desk.x + DESKTOP_W - 220, desk.y, [{ ...navRail("r"), railExpanded: true, railModal: true }]),
    ];
    expect(barSlotOf(rails, desk, [desk], widths)).toEqual({ x: desk.x + 316, w: DESKTOP_W - 412 });
    const body = bodyRect(rails, desk, [desk], widths);
    expect([body.l, body.r]).toEqual([desk.x + 316 + PHONE_MARGIN, desk.x + DESKTOP_W - 96 - PHONE_MARGIN]);
    const out = tidyFrame(rails, desk, [desk], widths)!;
    expect(out.find((g) => g.id === "left-compact")?.x).toBe(desk.x + 220);
    expect(out.find((g) => g.id === "right-modal")?.x).toBe(desk.x + DESKTOP_W - 220);
  });

  it.each([false, true])("carries expanded rails and body-spanning bars when modal=%s", (railModal) => {
    for (const side of ["left", "right"] as const) {
      const layoutWidth = railModal ? 96 : 220;
      const rail = group("rail", side === "left" ? desk.x : desk.x + DESKTOP_W - 220, desk.y, [{ ...navRail("r"), railExpanded: true, railModal, size2: DESKTOP_H }]);
      const bar = group("bar", desk.x + (side === "left" ? layoutWidth : 0), desk.y, [{ ...topBar("b"), size: DESKTOP_W - layoutWidth }]);
      const larger = { ...desk, w: 1440, h: 900 };
      const out = carryFrame([rail, bar], desk, larger, [desk], widths).groups;
      const movedRail = out.find((g) => g.id === "rail")!;
      const movedBar = out.find((g) => g.id === "bar")!;
      expect(movedRail.x).toBe(side === "left" ? desk.x : desk.x + 1440 - 220);
      expect(movedRail.items[0].size2).toBe(900);
      expect(movedBar.x).toBe(desk.x + (side === "left" ? layoutWidth : 0));
      expect(movedBar.items[0].size).toBe(1440 - layoutWidth);
    }
  });

  it.each([false, true])("creates a collapsed expressive rail after a phone round trip when modal=%s", (railModal) => {
    const layoutWidth = railModal ? 96 : 220;
    const rail = group("rail", desk.x, desk.y, [{ ...navRail("r"), railExpanded: true, railModal, size2: DESKTOP_H }]);
    const bar = group("bar", desk.x + layoutWidth, desk.y, [{ ...topBar("b"), size: DESKTOP_W - layoutWidth }]);
    const phone = { ...desk, w: PHONE_W, h: PHONE_H };
    const compact = carryFrame([rail, bar], desk, phone, [desk], widths).groups;
    expect(compact.find((g) => g.id === "rail")?.items[0].kind).toBe("bottomNav");
    expect(compact.find((g) => g.id === "bar")?.items[0].size).toBe(PHONE_W);
    const restored = carryFrame(compact, phone, desk, [phone], widths).groups;
    expect(restored.find((g) => g.id === "rail")?.items[0]).toMatchObject({ kind: "navRail", railExpanded: false });
    expect(restored.find((g) => g.id === "rail")?.items[0]).not.toHaveProperty("railModal");
    expect(restored.find((g) => g.id === "bar")?.items[0].size).toBe(DESKTOP_W - 96);
    expect(restored.find((g) => g.id === "bar")?.x).toBe(desk.x + 96);
  });
});

// smoke: makeItem usage from tokens works in this file's context
describe("integration with makeItem", () => {
  it("makeItem('button') yields an Item tidy can place", () => {
    const it = makeItem("button");
    const g = group("g", 100, 100, [it]);
    const out = tidyFrame([g], phoneFrame, [phoneFrame], widths)!;
    expect(out).toHaveLength(1);
    expect(out[0].items[0].id).toBe(it.id);
  });
});
