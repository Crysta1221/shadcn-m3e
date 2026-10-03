import { barSlotOf, railSide } from "./tidy";
import { Frame, Group, Item, carryItemSize, frameOfGroup, frameSizeOf, railExpansionSide, railLayoutWidth, railWidth } from "./tokens";

/** First-version modal rails must own their group; grouping one collapses it. */
export function constrainModalRails(groups: Group[]): Group[] {
  let changed = false;
  const next = groups.map((group) => {
    if (group.items.length === 1 || !group.items.some((it) => it.kind === "navRail" && it.railModal)) return group;
    changed = true;
    return { ...group, items: group.items.map((it) => {
      if (it.kind !== "navRail" || !it.railModal) return it;
      const { [railExpansionSide]: _side, ...item } = it;
      return { ...item, railModal: false, railExpanded: false };
    }) };
  });
  return changed ? next : groups;
}

export const modalRailOf = (group: Group) => group.items.length === 1 && group.items[0].kind === "navRail" && group.items[0].railModal && group.items[0].railExpanded ? group.items[0] : undefined;

/** Change a rail without tidying the screen or losing hand-placed vertical positions. */
export function updateRail(groups: Group[], frames: Frame[], widths: Record<string, number>, id: string, patch: Partial<Item>): Group[] {
  const target = groups.find((g) => g.items.some((it) => it.id === id && it.kind === "navRail"));
  if (!target) return groups;
  const item = target.items.find((it) => it.id === id)!;
  const updated = { ...item, ...patch };
  if (target.items.length > 1 && updated.railModal) return constrainModalRails(groups);
  if (Object.entries(patch).every(([key, value]) => item[key as keyof Item] === value)) return groups;
  const frame = frameOfGroup(target, frames, widths);
  const standalone = target.items.length === 1;
  const right = standalone && frame && railSide(target, frame, widths) === "right";
  const x = right ? target.x + railWidth(item) - railWidth(updated) : target.x;
  if (standalone && frame && !item.railExpanded && updated.railExpanded) {
    updated[railExpansionSide] = right ? "right" : "left";
  } else if (!updated.railExpanded) {
    delete updated[railExpansionSide];
  }
  const next = groups.map((g) => g === target ? {
    ...g,
    x,
    items: g.items.map((it) => it.id === id ? updated : it),
  } : g);
  if (!standalone || !frame) return next;

  const before = barSlotOf(groups, frame, frames, widths);
  /* Resizing can move the rail's centre across the frame midpoint. Keep the side
   * chosen before the edit when computing its effect on the body's layout slot. */
  const delta = railLayoutWidth(updated) - railLayoutWidth(item);
  const after = { x: before.x + (right ? 0 : delta), w: before.w - delta };
  if (before.x === after.x && before.w === after.w) return next;
  const { h } = frameSizeOf(frame);
  const owners = new Set(groups.filter((g) => frameOfGroup(g, frames, widths)?.id === frame.id).map((g) => g.id));
  return next.map((g) => {
    if (!owners.has(g.id) || g.locked || g.items.some((it) => it.kind === "navRail")) return g;
    return {
      ...g,
      x: g.x + after.x - before.x,
      /* Hand-made groups keep their internal geometry; only the whole group follows the body. */
      items: g.free ? g.items : g.items.map((it) => carryItemSize(it, { w: before.w, h }, { w: after.w, h })),
    };
  });
}
