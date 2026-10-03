import { createHash } from "node:crypto";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { CircularProgress, LinearProgress } from "./Loading";

const refs = vi.hoisted(() => [] as { current: unknown }[]);
vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useRef: (current: unknown) => {
    const ref = { current };
    refs.push(ref);
    return ref;
  },
  useEffect: () => {},
}));
vi.mock("@/lib/shapes", () => ({}));

// Exercise the real SVG elements and animation callback without a browser clock.
function render(component: typeof LinearProgress | typeof CircularProgress, props: Record<string, unknown>) {
  refs.length = 0;
  const svg = component({ width: 240, size: 48, color: "#123", trackColor: "#abc", ...props } as never);
  const elements = (svg.props.children as (ReactElement<Record<string, unknown>> | false)[])
    .filter((child): child is ReactElement<Record<string, unknown>> => !!child);
  const children = elements.map(({ type, props: attributes }) => {
    const { ref, ...rest } = attributes;
    const result = { type, ...rest } as Record<string, unknown>;
    if (ref) (ref as { current: unknown }).current = {
      setAttribute: (name: string, value: string) => { result[name] = value; },
    };
    return result;
  });
  const frame = refs.at(-1)!.current as (time: number) => void;
  frame(1);
  return {
    children,
    frame: (ms: number) => {
      frame(ms + 1);
      return { width: svg.props.width, height: svg.props.height, viewBox: svg.props.viewBox, children };
    },
  };
}

// Golden SVG hashes were verified against Loading.tsx at upstream 52d47f1,
// before trackThickness existed. They include every path, cap, stop and viewport.
// Never regenerate these from a changed implementation to accept a visual change.
describe("legacy 4dp SVG rendering", () => {
  for (const [name, component, dimension, sizes, cycle] of [
    ["linear", LinearProgress, "width", [24, 240, 480], 1800],
    ["circular", CircularProgress, "size", [24, 48, 96], 6660],
  ] as const) {
    for (const wavy of [false, true]) {
      for (const size of sizes) {
        for (const determinate of [false, true]) {
          it(`${name} ${size} ${wavy ? "wavy" : "flat"} ${determinate ? "determinate" : "indeterminate"}`, () => {
            for (const trackThickness of [undefined, 4] as const) {
              const hash = createHash("sha256");
              if (determinate) {
                const values = [-1, ...Array.from({ length: 1001 }, (_, i) => i / 1000), 2];
                for (const value of values) {
                  const svg = render(component, { [dimension]: size, wavy, value, trackThickness });
                  for (const ms of [0, 517, 1800]) hash.update(JSON.stringify(svg.frame(ms)));
                }
              } else {
                const svg = render(component, { [dimension]: size, wavy, trackThickness });
                for (let ms = 0; ms <= cycle * 2; ms += 17) hash.update(JSON.stringify(svg.frame(ms)));
                for (const ms of [333, 666, 750, 1000, 1183, 1267, 1332, 1567, 1800, cycle]) {
                  hash.update(JSON.stringify(svg.frame(ms)));
                }
              }
              expect(hash.digest("hex")).toMatchSnapshot();
            }
          });
        }
      }
    }
  }
});

describe("linear track thickness", () => {
  it.each([false, true])("keeps the legacy trailing track clamp at 99%% and 100%% (wavy=%s)", (wavy) => {
    for (const value of [0.99, 1]) {
      const svg = render(LinearProgress, { value, wavy });
      expect(svg.children[0].d).toBe(`M234.00 ${wavy ? "6.00" : "3.00"}L238.00 ${wavy ? "6.00" : "3.00"}`);
    }
  });

  it.each([4, 8])("draws %idp strokes with a stop as tall as the track", (trackThickness) => {
    const svg = render(LinearProgress, { value: 0.5, trackThickness });
    expect(svg.children.slice(0, 3).map((child) => child.strokeWidth)).toEqual(Array(3).fill(trackThickness));
    expect(svg.children[3]).toMatchObject({ type: "circle", r: trackThickness / 2, cx: 240 - trackThickness });
    expect(svg.frame(0).height).toBe(trackThickness + 2);
  });

  it("leaves a 4dp visible gap for the new 8dp track", () => {
    const svg = render(LinearProgress, { value: 0.5, trackThickness: 8 });
    expect(svg.children[1].d).toBe("M4.00 5.00L120.00 5.00");
    expect(svg.children[0].d).toBe("M132.00 5.00L236.00 5.00");
    /* a stub of track stays under the stop indicator, as at 4dp */
    expect(render(LinearProgress, { value: 1, trackThickness: 8 }).children[0].d).toBe("M228.00 5.00L236.00 5.00");
  });
});
