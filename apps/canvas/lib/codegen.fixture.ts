import { Doc, Group, KIND_SPEC, Kind, makeItem, PHONE_H, sizeOf } from "./tokens";

/** A sketch with one part of every kind, each on its own row of a phone screen, so
 *  the generated code can be tested and type-checked against the real components. */
export function allKindsDoc(): Doc {
  const kinds = Object.keys(KIND_SPEC) as Kind[];
  const groups: Group[] = kinds.map((kind, i) => ({
    id: `g-${kind}`,
    x: 16,
    y: 24 + i * 120,
    axis: "x",
    items: [{ ...makeItem(kind), id: `i-${kind}` }],
  }));
  return {
    groups,
    frames: [
      { id: "f-all", name: "All parts", x: 0, y: 0, h: 24 + kinds.length * 120 + 24 },
      { id: "f-2", name: "日本語", x: 600, y: 0 },
    ],
    paletteKey: "purple",
    frame: "phone",
    title: "All parts",
    brief: "",
  };
}

/** A long screen exercises the scrolling scaffold and both generations of folding FAB. */
export function scrollingDoc(): Doc {
  const nav = { ...makeItem("bottomNav"), id: "nav" };
  return {
    ...allKindsDoc(), title: "Scrolling", frames: [{ id: "long", name: "Long", x: 0, y: 0, length: PHONE_H * 2 }],
    groups: [
      { id: "top", x: 0, y: 0, axis: "x", items: [{ ...makeItem("topAppBar"), id: "top" }] },
      { id: "body", x: 16, y: 1200, axis: "x", items: [{ ...makeItem("button"), id: "body", label: "Below the fold" }] },
      { id: "fab", x: 200, y: PHONE_H * 2 - 180, axis: "x", items: [{ ...makeItem("extendedFab"), id: "fab", label: "Create", icon: "add", collapseOnScroll: true }] },
      { id: "nav", x: 0, y: PHONE_H * 2 - sizeOf(nav, {}).h, axis: "x", items: [nav] },
    ],
  };
}
