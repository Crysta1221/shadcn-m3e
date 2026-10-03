import { Doc, Group, KIND_SPEC, Kind, makeItem } from "./tokens";

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
