import { Group, layoutOf } from "./tokens";

/** Animate only geometry changed by this rail action, not future screen interactions. */
export function railMotionTargets(before: Group[], after: Group[], widths: Record<string, number>, railId: string) {
  const groups = new Set<string>();
  const items = new Set<string>([railId]);
  const previous = new Map(before.map((group) => [group.id, group]));
  for (const group of after) {
    const old = previous.get(group.id);
    if (!old) continue;
    if (old.x !== group.x || old.y !== group.y) groups.add(group.id);
    const placed = new Map(layoutOf(old, widths).map((part) => [part.item.id, part]));
    for (const part of layoutOf(group, widths)) {
      const was = placed.get(part.item.id);
      if (!was) continue;
      if (was.w !== part.w || was.h !== part.h) items.add(part.item.id);
    }
  }
  return { groups, items };
}
