import { describe, expect, it } from "vitest";
import { updateRail } from "./rail";
import { barSlotOf, bodyRect, carryFrame, railSide, tidyFrame } from "./tidy";
import { Frame, Group, Item, railExpansionSide } from "./tokens";

const frame: Frame = { id: "f", name: "Desktop", x: 20, y: 40, w: 1280, h: 800 };
const rail: Item = { id: "rail", kind: "navRail", label: "", icon: "menu", variant: "filled", railExpanded: false, size2: 800 };
const bar: Item = { id: "bar", kind: "topAppBar", label: "Title", icon: "menu", variant: "filled", size: 1184 };
const group = (id: string, x: number, items: Item[]): Group => ({ id, x, y: 40, axis: "x", items });
const stage = (right = false): Group[] => [group("rail-group", right ? 1204 : 20, [rail]), group("bar-group", right ? 20 : 116, [bar])];

describe("updateRail", () => {
  it("removes rail-only state when converting to a bottom bar and preserves navigation intent", () => {
    const originalItem: Item = { ...rail, railExpanded: true, railModal: true, [railExpansionSide]: "right", tabs: [{ icon: "home", label: "Home" }], selected: 0, actions: { "tab:0": { to: "home", transition: "fade" } }, radiusTop: 8, radiusBottom: 16 };
    const original = [group("nav", 1080, [originalItem])];
    const phone = { ...frame, w: 412 };
    const compact = carryFrame(original, frame, phone, [frame], {}).groups;
    const item = compact[0].items[0];
    expect(item).not.toHaveProperty("railExpanded");
    expect(item).not.toHaveProperty("railModal");
    expect(item[railExpansionSide]).toBeUndefined();
    expect(item).toMatchObject({ kind: "bottomNav", tabs: originalItem.tabs, selected: 0, actions: originalItem.actions, radiusTop: 16, radiusBottom: 8 });
    expect(JSON.stringify(item)).not.toContain("railExpanded");
    expect(JSON.stringify(item)).not.toContain("railModal");
    const restored = carryFrame(compact, phone, frame, [phone], {}).groups[0].items[0];
    expect(restored).toMatchObject({ kind: "navRail", railExpanded: false, tabs: originalItem.tabs, selected: 0, actions: originalItem.actions, radiusTop: 8, radiusBottom: 16 });
    expect(restored).not.toHaveProperty("railModal");
    expect(restored[railExpansionSide]).toBeUndefined();
  });

  it.each([[100, 600, "right"], [1200, -600, "left"]] as const)("ignores the empty free-group origin at %s", (x, offset, side) => {
    const original = [{ ...group("free", x, [rail]), free: true, pos: { rail: { x: offset, y: 0 } } }];
    expect(railSide(original[0], frame, {})).toBe(side);
    const expanded = updateRail(original, [frame], {}, "rail", { railExpanded: true });
    expect(railSide(expanded[0], frame, {})).toBe(side);
    expect(updateRail(expanded, [frame], {}, "rail", { railExpanded: false })).toEqual(original);
  });

  it.each([false, true])("resizes the complete body between neighbouring rails (modal=%s)", (railModal) => {
    const leftWidth = railModal ? 96 : 220;
    const original = [
      group("left", 20, [{ ...rail, railExpanded: true, railModal }]),
      group("right", 1204, [{ ...rail, id: "right" }]),
      group("body", 20 + leftWidth, [{ ...bar, size: 1280 - leftWidth - 96 }]),
    ];
    const larger = { ...frame, w: 1440 };
    const out = carryFrame(original, frame, larger, [frame], {}).groups;
    expect(out.find((g) => g.id === "body")!.items[0].size).toBe(1440 - leftWidth - 96);
    const restored = carryFrame(out, larger, frame, [larger], {}).groups;
    expect(restored.find((g) => g.id === "body")!.items[0].size).toBe(1280 - leftWidth - 96);
  });

  it("keeps the remaining rail's slot when only the first rail becomes a bottom bar", () => {
    const original = [
      group("left", 20, [rail]),
      group("right", 1204, [{ ...rail, id: "right" }]),
      group("body", 116, [{ ...bar, size: 1088 }]),
    ];
    const phone = { ...frame, w: 412 };
    const compact = carryFrame(original, frame, phone, [frame], {}).groups;
    expect(compact.find((g) => g.id === "left")!.items[0].kind).toBe("bottomNav");
    expect(compact.find((g) => g.id === "right")!.items[0].kind).toBe("navRail");
    expect(compact.find((g) => g.id === "body")!.items[0].size).toBe(316);
    const restored = carryFrame(compact, phone, frame, [phone], {}).groups;
    expect(restored.find((g) => g.id === "left")!.items[0].kind).toBe("navRail");
    expect(restored.find((g) => g.id === "body")!.items[0].size).toBe(1088);
  });
  it("uses the actual rail bounds when a standalone free group retains an offset", () => {
    const original = [{ ...group("free", 570, [rail]), free: true, pos: { rail: { x: 120, y: 0 } } }];
    expect(railSide(original[0], frame, {})).toBe("right");
    const expanded = updateRail(original, [frame], {}, "rail", { railExpanded: true });
    expect(railSide(expanded[0], frame, {})).toBe("right");
    expect(updateRail(expanded, [frame], {}, "rail", { railExpanded: false })).toEqual(original);
  });

  it.each([false, true])("keeps neighbouring layout slots stable through modal toggles on the right=%s", (right) => {
    const original = [
      group("outer", right ? 1204 : 20, [{ ...rail, railModal: true }]),
      group("inner", right ? 1108 : 116, [{ ...rail, id: "inner-rail" }]),
      group("body", right ? 20 : 212, [{ ...bar, size: 1088 }]),
    ];
    let current = original;
    for (let i = 0; i < 3; i++) {
      for (const railExpanded of [true, false]) {
        current = updateRail(current, [frame], {}, "rail", { railExpanded });
        current = tidyFrame(current, frame, [frame], {}) ?? current;
        expect(current[1].x).toBe(original[1].x);
        expect(current[2].x).toBe(original[2].x);
        expect(barSlotOf(current, frame, [frame], {})).toEqual({ x: original[2].x, w: 1088 });
        expect(tidyFrame(current, frame, [frame], {})).toBeNull();
      }
    }
  });

  it.each([undefined, false, true])("finds a rail after a bottom bar when carrying a frame (expanded=%s)", (railExpanded) => {
    const layoutWidth = railExpanded === undefined ? 80 : railExpanded ? 220 : 96;
    const original = [
      group("bottom", 20, [{ ...bar, kind: "bottomNav", size: 1280 }]),
      group("legacy-rail", 20, [{ ...rail, railExpanded }]),
      group("body", 20 + layoutWidth, [{ ...bar, size: 1280 - layoutWidth }]),
    ];
    const out = carryFrame(original, frame, { ...frame, w: 1440 }, [frame], {}).groups;
    // Only the first bottom bar becomes a new, collapsed 96dp expressive rail.
    expect(out.find((g) => g.id === "bottom")!.items[0].railExpanded).toBe(false);
    expect(out.find((g) => g.id === "body")!.items[0].size).toBe(1344 - layoutWidth);
  });

  it.each([false, true])("keeps a near-centre right rail's body origin when modal=%s", (railModal) => {
    const original = stage(true);
    original[0] = { ...original[0], x: 630, items: [{ ...rail, railModal }] };
    const expanded = updateRail(original, [frame], {}, "rail", { railExpanded: true });
    expect(expanded[0].x).toBe(506);
    expect(expanded[1].x).toBe(original[1].x);
    expect(expanded[1].items[0].size).toBe(railModal ? 1184 : 1060);
    expect(updateRail(expanded, [frame], {}, "rail", { railExpanded: false })).toEqual(original);
    const saved = JSON.parse(JSON.stringify(expanded));
    expect(saved[0].items[0]).not.toHaveProperty("railAnchor");
    expect(Object.getOwnPropertySymbols(saved[0].items[0])).toEqual([]);
    expect(railSide(saved[0], frame, {})).toBe("left");
  });

  it("keeps the expansion edge after nudges or frame moves, and follows a move across the midpoint", () => {
    const original = stage(true);
    original[0] = { ...original[0], x: 630 };
    const expanded = updateRail(original, [frame], {}, "rail", { railExpanded: true });
    const nudged = expanded.map((g, i) => i === 0 ? { ...g, x: g.x + 1 } : g);
    expect(updateRail(nudged, [frame], {}, "rail", { railExpanded: false })[0].x).toBe(631);
    expect(railSide(expanded[0], { ...frame, x: frame.x + 1 }, {})).toBe("right");
    const moved = expanded.map((g) => ({ ...g, x: g.x + 500 }));
    const collapsed = updateRail(moved, [{ ...frame, x: frame.x + 500 }], {}, "rail", { railExpanded: false });
    expect(collapsed).toEqual(original.map((g) => ({ ...g, x: g.x + 500 })));

    const dragged = expanded.map((g, i) => i === 0 ? { ...g, x: 30 } : g);
    const afterDrag = updateRail(dragged, [frame], {}, "rail", { railExpanded: false });
    expect(afterDrag[0].x).toBe(30);
    expect(afterDrag[0].items[0][railExpansionSide]).toBeUndefined();
  });

  it("uses the saved side for body bounds, tidy and frame resizing", () => {
    const original = stage(true);
    original[0] = { ...original[0], x: 630 };
    const expanded = updateRail(original, [frame], {}, "rail", { railExpanded: true });
    expect(barSlotOf(expanded, frame, [frame], {})).toEqual({ x: 20, w: 1060 });
    expect(bodyRect(expanded, frame, [frame], {}).l).toBe(36);
    expect(railSide({ ...expanded[0], x: expanded[0].x + 1e-10 }, frame, {})).toBe("right");
    const tidied = tidyFrame(expanded, frame, [frame], {})!;
    expect(tidied[0].x).toBe(1080);
    expect(tidied[0].items[0][railExpansionSide]).toBe("right");
    expect(updateRail(tidied, [frame], {}, "rail", { railExpanded: false })[0].x).toBe(1204);

    const larger = { ...frame, w: 1440 };
    const carried = carryFrame(expanded, frame, larger, [frame], {}).groups;
    expect(carried[0].x).toBe(1240);
    expect(carried[0].items[0][railExpansionSide]).toBe("right");
    expect(updateRail(carried, [larger], {}, "rail", { railExpanded: false })[0].x).toBe(1364);
  });

  it.each([false, true])("expands and collapses a standard rail reversibly on the right=%s", (right) => {
    const original = stage(right);
    const expanded = updateRail(original, [frame], {}, "rail", { railExpanded: true });
    expect(expanded[0].x).toBe(right ? 1080 : 20);
    expect(expanded[1].x).toBe(right ? 20 : 240);
    expect(expanded[1].items[0].size).toBe(1060);
    expect(expanded.map((g) => g.y)).toEqual(original.map((g) => g.y));
    expect(updateRail(expanded, [frame], {}, "rail", { railExpanded: false })).toEqual(original);
    expect(original[0].items[0].railExpanded).toBe(false);
  });

  it.each([false, true])("keeps the body unchanged while a modal rail expands on the right=%s", (right) => {
    const original = stage(right);
    original[0] = { ...original[0], items: [{ ...rail, railModal: true }] };
    const expanded = updateRail(original, [frame], {}, "rail", { railExpanded: true });
    expect(expanded[0].x).toBe(right ? 1080 : 20);
    expect(expanded[1]).toBe(original[1]);
    expect(updateRail(expanded, [frame], {}, "rail", { railExpanded: false })).toEqual(original);
  });

  it("reflows the body when an expanded rail switches between standard and modal", () => {
    const expanded = updateRail(stage(), [frame], {}, "rail", { railExpanded: true });
    const modal = updateRail(expanded, [frame], {}, "rail", { railModal: true });
    expect(modal[0].x).toBe(expanded[0].x);
    expect(modal[1].x).toBe(116);
    expect(modal[1].items[0].size).toBe(1184);
    const standard = updateRail(modal, [frame], {}, "rail", { railModal: false });
    expect(standard[1]).toEqual(expanded[1]);
  });

  it("leaves locked groups and other screens untouched", () => {
    const locked = { ...group("locked", 116, [{ ...bar, id: "locked-bar" }]), locked: true };
    const other = group("other", 1516, [{ ...bar, id: "other-bar" }]);
    const original = [...stage(), locked, other];
    const frames = [frame, { ...frame, id: "other-frame", x: 1420 }];
    const out = updateRail(original, frames, {}, "rail", { railExpanded: true });
    expect(out[2]).toBe(locked);
    expect(out[3]).toBe(other);
  });

  it("moves hand-made groups as a whole without resizing their members", () => {
    const free: Group = { ...group("free", 116, [{ ...bar, id: "free-bar" }]), free: true, pos: { "free-bar": { x: 8, y: 90 } } };
    const out = updateRail([...stage(), free], [frame], {}, "rail", { railExpanded: true });
    expect(out[2].x).toBe(240);
    expect(out[2].items).toBe(free.items);
    expect(out[2].pos).toBe(free.pos);
    expect(out[2].y).toBe(free.y);
  });

  it("only patches a rail inside a hand-made group", () => {
    const original = [group("mixed", 116, [rail, bar]), group("other", 500, [{ ...bar, id: "other-bar" }])];
    const out = updateRail(original, [frame], {}, "rail", { railExpanded: true });
    expect(out[0].x).toBe(original[0].x);
    expect(out[0].items[0].railExpanded).toBe(true);
    expect(out[0].items[1]).toBe(bar);
    expect(out[1]).toBe(original[1]);
  });

  it("only patches a rail without an owning frame", () => {
    const original = [group("loose", 2000, [rail])];
    const out = updateRail(original, [frame], {}, "rail", { railExpanded: true });
    expect(out[0].x).toBe(2000);
    expect(out[0].items[0].railExpanded).toBe(true);
  });

  it("preserves a right rail's inset instead of snapping it to the screen edge", () => {
    const original = stage(true);
    original[0] = { ...original[0], x: original[0].x - 12 };
    const out = updateRail(original, [frame], {}, "rail", { railExpanded: true });
    expect(out[0].x).toBe(1068);
  });

  it("returns the same groups for a missing target or an unchanged patch", () => {
    const original = stage();
    expect(updateRail(original, [frame], {}, "missing", { railExpanded: true })).toBe(original);
    expect(updateRail(original, [frame], {}, "rail", { railExpanded: false })).toBe(original);
  });
});
