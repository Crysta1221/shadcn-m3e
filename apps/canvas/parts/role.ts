import { partBySlug, reader } from "./registry";
import type { PartRole } from "./types";

/** the role a legacy kind plays on a screen — what `PartDef.role` says for a real component */
const KIND_ROLE: Record<string, PartRole> = {
  topAppBar: "top",
  tabs: "top",
  bottomNav: "bottom",
  bottomSheet: "bottom",
  navRail: "rail",
  toolbar: "floatingBottom",
  snackbar: "floatingBottom",
  fab: "fab",
  extendedFab: "fab",
  fabMenu: "fab",
  dialog: "overlay",
  text: "label",
  switch: "control",
  checkbox: "control",
  radio: "control",
  iconButton: "control",
  carousel: "fullWidth",
  listItem: "listLike",
  textField: "listLike",
  select: "listLike",
  chip: "listLike",
  divider: "listLike",
  card: "listLike",
};

/** the smallest slice of an `Item` a role is read off: a legacy kind, or a component's
 *  slug and prop values (a floating toolbar is a `floatingBottom`, a docked one a `bottom`). */
export type RoleOf = { kind: string; component?: string; props?: Record<string, unknown> };

/** What a part does on a screen, for Tidy and the prompt: where it is pinned and how it is
 *  described. A real component answers from its `PartDef.role`, a legacy kind from the map
 *  above; the parts that belong in the body rows answer undefined. */
export function roleOf(it: RoleOf): PartRole | undefined {
  if (it.kind === "component") {
    const def = partBySlug(it.component);
    const r = def?.role;
    return typeof r === "function" ? r(reader(def!, it.props)) : r;
  }
  return KIND_ROLE[it.kind];
}

/** spans the screen edge to edge: the bars and a carousel, whose row is the screen.
 *  A sheet or drawer pinned to the bottom keeps its own width, like the bottomSheet kind. */
export const fullWidth = (it: RoleOf): boolean => {
  const r = roleOf(it);
  if (r === "top" || r === "fullWidth") return true;
  return r === "bottom" && (it.kind === "bottomNav" || it.component === "navigation-bar");
};
