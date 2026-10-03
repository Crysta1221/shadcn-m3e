import { describe, it, expect } from "vitest";

import { DEFAULT_THEME, PALETTES, Palette, paletteOf } from "./tokens";
import { contrastRatio, hexToRgb, isHex, onColorFor, railSelectedLabelColor, rgbToHex, rgbToLab, schemeFromSeed } from "./color";

/** perceptual lightness of a hex color, for readable-contrast assertions */
const toneOf = (hex: string) => rgbToLab(...hexToRgb(hex)!).L;

describe("isHex", () => {
  it("accepts a six-digit hex color with a leading #", () => {
    expect(isHex("#6750A4")).toBe(true);
    expect(isHex("#ff0088")).toBe(true);
  });

  it("rejects shorthand, missing #, and non-hex input", () => {
    expect(isHex("#fff")).toBe(false);
    expect(isHex("6750A4")).toBe(false);
    expect(isHex("#GGGGGG")).toBe(false);
  });
});

describe("hexToRgb / rgbToHex", () => {
  it("parses a hex color into channels", () => {
    expect(hexToRgb("#6750A4")).toEqual([103, 80, 164]);
    expect(hexToRgb("6750a4")).toEqual([103, 80, 164]);
  });

  it("round-trips any channel values through both directions", () => {
    for (const [r, g, b] of [[0, 0, 0], [255, 255, 255], [103, 80, 164], [18, 250, 199]] as const) {
      expect(hexToRgb(rgbToHex(r, g, b))).toEqual([r, g, b]);
    }
  });

  it("clamps channels outside 0..255 when formatting", () => {
    expect(rgbToHex(300, -4, 7.6)).toBe("#FF0008");
  });

  it("returns null for input that is not a hex color", () => {
    expect(hexToRgb("#XYZ123")).toBeNull();
    expect(hexToRgb("#ABC")).toBeNull();
  });
});

describe("schemeFromSeed", () => {
  const seed = "#6750A4";

  it.each([false, true])("keeps secondary labels readable across contrast levels (dark=%s)", (dark) => {
    for (const contrast of ["standard", "medium", "high"] as const) {
      const p = schemeFromSeed(seed, "Custom", { dark, contrast });
      expect(isHex(p.secondary)).toBe(true);
      expect(Math.abs(toneOf(p.secondary) - toneOf(p.surfaceContainer))).toBeGreaterThan(45);
      for (const expanded of [false, true]) {
        const background = expanded ? p.secondaryContainer : p.surfaceContainer;
        expect(contrastRatio(railSelectedLabelColor(p, expanded), background)).toBeGreaterThanOrEqual(4.5);
      }
      if (contrast === "standard") {
        expect(railSelectedLabelColor(p, false)).toBe(p.secondary);
        expect(railSelectedLabelColor(p, true)).toBe(p.secondary);
      }
      if (contrast === "high") {
        expect(railSelectedLabelColor(p, false)).toBe(p.secondary);
        expect(railSelectedLabelColor(p, true)).toBe(p.onSecondaryContainer);
      }
    }
    expect(toneOf(schemeFromSeed(seed, "Custom", { dark }).secondary)).toBeCloseTo(dark ? 80 : 40, 0);
  });

  it("honours the dark option: surfaces go dark, text on them light", () => {
    const light = schemeFromSeed(seed);
    const dark = schemeFromSeed(seed, "Custom", { dark: true });
    expect(toneOf(dark.surface)).toBeLessThan(toneOf(light.surface));
    expect(toneOf(dark.onSurface)).toBeGreaterThan(toneOf(light.onSurface));
  });

  it("honours the contrast option: high contrast pushes the accent further from the surface", () => {
    const standard = schemeFromSeed(seed);
    const high = schemeFromSeed(seed, "Custom", { contrast: "high" });
    expect(high.primary).not.toBe(standard.primary);
    expect(Math.abs(toneOf(high.primary) - toneOf(high.surface))).toBeGreaterThan(
      Math.abs(toneOf(standard.primary) - toneOf(standard.surface)),
    );
  });
});

describe("secondary palette role", () => {
  it("exists in every preset, light/dark mode and contrast level", () => {
    for (const preset of PALETTES) {
      for (const dark of [false, true]) {
        for (const contrast of ["standard", "medium", "high"] as const) {
          const p = paletteOf(preset.key, undefined, { ...DEFAULT_THEME, dark, contrast });
          expect(isHex(p.secondary)).toBe(true);
          expect(Math.abs(toneOf(p.secondary) - toneOf(p.surfaceContainer))).toBeGreaterThan(45);
        }
      }
    }
  });

  it("fills old custom palettes without changing their existing colors", () => {
    const { secondary: _secondary, ...saved } = { ...PALETTES[0], key: "custom" };
    const before = structuredClone(saved);
    const p = paletteOf("custom", saved as Palette);
    expect(isHex(p.secondary)).toBe(true);
    const { secondary: _generated, ...rest } = p;
    expect(rest).toEqual(before);
    expect(saved).toEqual(before);
    const custom = { ...p, secondary: "#123456" };
    expect(paletteOf("custom", custom)).toBe(custom);
  });
});

describe("onColorFor", () => {
  it("picks a dark on-color on a light background", () => {
    const on = onColorFor("#FFFFFF");
    expect(isHex(on)).toBe(true);
    expect(toneOf(on)).toBeLessThan(40);
  });

  it("picks a light on-color on a dark background", () => {
    const on = onColorFor("#000000");
    expect(isHex(on)).toBe(true);
    expect(toneOf(on)).toBeGreaterThan(90);
  });

  it("falls back to black when the background cannot be parsed", () => {
    expect(onColorFor("nope")).toBe("#000000");
  });
});
