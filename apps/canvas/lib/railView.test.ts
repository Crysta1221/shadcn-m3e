import { describe, expect, it } from "vitest";
import { railMotionTargets } from "./railView";
import { constrainModalRails, modalRailOf, updateRail } from "./rail";
import { Frame, Group, Item, railExpansionSide } from "./tokens";

const rail: Item = { id: "rail", kind: "navRail", label: "", icon: "menu", variant: "filled", railExpanded: false, railModal: true, size2: 500 };
const sibling: Item = { id: "sibling", kind: "button", label: "Sibling", icon: null, variant: "filled" };
const group: Group = { id: "mixed", x: 20, y: 40, axis: "x", items: [sibling, rail] };

describe("standalone modal rail invariant", () => {
  it.each([false, true])("collapses grouped modal rails without moving siblings (free=%s)", (free) => {
    const mixed: Group = { ...group, free, items: [sibling, { ...rail, railExpanded: true, [railExpansionSide]: "right" }], pos: { rail: { x: 12, y: 18 }, sibling: { x: 120, y: 150 } } };
    const input = [mixed];
    const before = input.map((g) => ({ ...g, items: g.items.map((it) => ({ ...it })) }));
    const [next] = constrainModalRails(input);
    expect(next.items[1]).toMatchObject({ railExpanded: false, railModal: false });
    expect(next.items[1][railExpansionSide]).toBeUndefined();
    expect(next.items[0]).toBe(sibling);
    expect(next.pos).toBe(mixed.pos);
    expect([next.x, next.y, next.axis]).toEqual([mixed.x, mixed.y, mixed.axis]);
    expect(modalRailOf(next)).toBeUndefined();
    expect(input).toEqual(before);
    expect(constrainModalRails([next])[0]).toBe(next);
    expect(constrainModalRails(JSON.parse(JSON.stringify(input)))).toEqual([next]);
  });

  it("keeps standalone modal, mixed standard and legacy rails unchanged", () => {
    const standalone = { ...group, items: [{ ...rail, railExpanded: true }] };
    const mixed = { ...group, items: [sibling, { ...rail, railModal: false, railExpanded: true }] };
    const legacy = { ...group, items: [sibling, { ...rail, railModal: undefined, railExpanded: undefined }] };
    const input = [standalone, mixed, legacy];
    expect(constrainModalRails(input)).toBe(input);
    expect(modalRailOf(standalone)).toBe(standalone.items[0]);
    expect(modalRailOf(mixed)).toBeUndefined();
    expect(modalRailOf(legacy)).toBeUndefined();
  });

  it("refuses modal patches in mixed groups and permits them after ungrouping", () => {
    const mixed = [{ ...group, items: [sibling, { ...rail, railModal: false }] }];
    expect(updateRail(mixed, [], {}, rail.id, { railModal: true, railExpanded: true })).toBe(mixed);
    const single = [{ ...group, items: [{ ...rail, railModal: false }] }];
    const expanded = updateRail(single, [], {}, rail.id, { railModal: true, railExpanded: true });
    expect(modalRailOf(expanded[0])?.id).toBe(rail.id);
  });
});

describe("rail motion scope", () => {
  const frame: Frame = { id: "f", name: "Desktop", x: 0, y: 0, w: 1280, h: 800 };
  const before: Group[] = [
    { id: "nav", x: 0, y: 0, axis: "x", items: [{ ...rail, railModal: false, size2: 800 }] },
    { id: "bar", x: 96, y: 0, axis: "x", items: [{ ...sibling, id: "bar", kind: "topAppBar", size: 1184 }] },
    { ...group, id: "body", x: 112, y: 120, items: [sibling] },
    { ...group, id: "locked", locked: true, x: 112, y: 400, items: [{ ...sibling, id: "locked" }] },
  ];

  it("targets only the rail, resized bar and moved groups", () => {
    const after = updateRail(before, [frame], {}, "rail", { railExpanded: true });
    const motion = railMotionTargets(before, after, {}, "rail");
    expect([...motion.groups]).toEqual(["bar", "body"]);
    expect([...motion.items]).toEqual(["rail", "bar"]);
    expect(motion.items.has("locked")).toBe(false);
    expect(motion.items.has("sibling")).toBe(false);
  });

  it("keeps unrelated groups out of a modal toggle", () => {
    const modal = before.map((g, i) => i === 0 ? { ...g, items: [{ ...rail, size2: 800 }] } : g);
    const after = updateRail(modal, [frame], {}, "rail", { railExpanded: true });
    const motion = railMotionTargets(modal, after, {}, "rail");
    expect([...motion.groups]).toEqual([]);
    expect([...motion.items]).toEqual(["rail"]);
  });
});
