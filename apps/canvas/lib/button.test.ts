/**
 * lib/tokens.ts — the button's M3 size scale and the link a tap can open.
 *
 * Locks in:
 *  - buttonMetrics returns Material's own values on each named size, and mixes them in between
 *  - a height the author set reaches sizeOf, baseRadii and the narrowest width a button may take
 *  - a chip is measured on a scale of its own, and a run of chips shares one height
 *  - linkUrlOf only hands back addresses a browser may follow, and completes a bare host
 */
import { describe, expect, it } from "vitest";
import {
  BUTTON_H_MAX,
  BUTTON_H_MIN,
  BUTTON_SIZES,
  CHIP_H_MAX,
  CHIP_H_MIN,
  CHIP_SIZES,
  chipHeightOf,
  chipMetrics,
  connectSpecOf,
  H,
  Item,
  LINK_TARGET,
  buttonHeightOf,
  buttonMetrics,
  buttonSizeKeyOf,
  baseRadii,
  linkHostOf,
  linkUrlOf,
  makeItem,
  matchRunSize,
  runSizePatch,
  sizeOf,
  splitMetrics,
  splitOpens,
  splitMenuHeight,
  splitMenuRisesAt,
  reorderTabsPatch,
  SPLIT_MENU_ITEM_H,
  SPLIT_MENU_PAD,
} from "./tokens";

const button = (patch: Partial<Item> = {}): Item => ({ ...makeItem("button"), ...patch });

describe("the button's M3 size scale", () => {
  it("keeps Material's own values on each named size", () => {
    expect(BUTTON_SIZES.map((s) => s.h)).toEqual([32, 40, 56, 96, 136]);
    expect(buttonMetrics(32)).toEqual({ h: 32, padX: 12, gap: 8, icon: 20, font: 14 });
    expect(buttonMetrics(56)).toEqual({ h: 56, padX: 24, gap: 8, icon: 24, font: 16 });
    expect(buttonMetrics(136)).toEqual({ h: 136, padX: 64, gap: 16, icon: 40, font: 32 });
  });

  it("mixes the two sizes a height falls between", () => {
    const mid = buttonMetrics(76); // halfway from M (56) to L (96)
    expect(mid).toEqual({ h: 76, padX: 36, gap: 10, icon: 28, font: 20 });
    expect(buttonSizeKeyOf(76)).toBeNull();
    expect(buttonSizeKeyOf(96)).toBe("l");
  });

  it("stays inside the scale whatever height it is handed", () => {
    expect(buttonMetrics(-40).h).toBe(BUTTON_H_MIN);
    expect(buttonMetrics(400).h).toBe(BUTTON_H_MAX);
    expect(buttonHeightOf(button())).toBe(H);
    expect(buttonHeightOf(button({ size2: 1000 }))).toBe(BUTTON_H_MAX);
  });

  it("carries the height into the drawn box, its corners and how narrow it may be", () => {
    const tall = button({ size: 200, size2: 96 });
    expect(sizeOf(tall, {})).toEqual({ w: 200, h: 96 });
    expect(baseRadii(tall)).toEqual({ tl: 48, tr: 48, bl: 48, br: 48 });
    /* at its narrowest the button is a circle, so a taller one cannot be as narrow */
    expect(buttonHeightOf(tall)).toBe(96);
    expect(buttonHeightOf(button())).toBe(H);
  });
});

describe("a tap that opens a link", () => {
  const link = (url?: string) => ({ to: LINK_TARGET, transition: "none" as const, url });

  it("reads a bare host as https and keeps a full address as it is", () => {
    expect(linkUrlOf(link("example.com/docs"))).toBe("https://example.com/docs");
    expect(linkUrlOf(link("http://example.com/"))).toBe("http://example.com/");
    expect(linkHostOf(link("example.com/docs"))).toBe("example.com");
  });

  it("hands back nothing for an address the browser must not follow", () => {
    expect(linkUrlOf(link(" "))).toBeNull();
    expect(linkUrlOf(link("javascript:alert(1)"))).toBeNull();
    expect(linkUrlOf(link("mailto:someone@example.com"))).toBeNull();
    expect(linkUrlOf(undefined)).toBeNull();
    expect(linkHostOf(link("not a url"))).toBeNull();
  });
});

describe("an icon button is the button that is all icon", () => {
  it("takes the same five sizes, measured across its circle", () => {
    const it = makeItem("iconButton");
    expect(it.size).toBe(H);
    expect(buttonHeightOf(it)).toBe(H);
    expect(buttonHeightOf({ ...it, size: 96 })).toBe(96);
    expect(buttonHeightOf({ ...it, size: 999 })).toBe(BUTTON_H_MAX);
    /* a circle: one measure both ways, and corners to match */
    expect(sizeOf({ ...it, size: 96 }, {})).toEqual({ w: 96, h: 96 });
    expect(baseRadii({ ...it, size: 96 })).toEqual({ tl: 48, tr: 48, bl: 48, br: 48 });
  });

  it("reads its icon off the same scale a button does", () => {
    expect(buttonMetrics(buttonHeightOf(makeItem("iconButton"))).icon).toBe(24);
    expect(buttonMetrics(buttonHeightOf({ ...makeItem("iconButton"), size: 136 })).icon).toBe(40);
  });
});

describe("a run of buttons shares one measure", () => {
  const button = (patch: Partial<Item> = {}): Item => ({ ...makeItem("button"), id: "b", ...patch });
  const icon = (patch: Partial<Item> = {}): Item => ({ ...makeItem("iconButton"), id: "i", ...patch });

  it("hands the joining part the size of the run that is standing still", () => {
    /* a small icon button carried onto a tall button comes out as tall as the run */
    expect(matchRunSize(icon({ size: 40 }), button({ size2: 96 })).size).toBe(96);
    /* and a button joining a run of small icon buttons comes down to them */
    expect(matchRunSize(button({ size: 200, size2: 96 }), icon({ size: 40 })).size2).toBe(40);
    /* a button narrower than it is tall grows wide enough to stay a button */
    expect(matchRunSize(button({ size: 60 }), button({ size2: 96 })).size).toBe(96);
  });

  it("leaves a part that already fits, and parts that never fuse", () => {
    const b = button({ size2: 96 });
    expect(matchRunSize(icon({ size: 96 }), b)).toEqual(icon({ size: 96 }));
    expect(matchRunSize(makeItem("chip"), b).size2).toBeUndefined();
  });

  it("carries a height across the run, and leaves each width alone", () => {
    const run = [button({ id: "a", size: 200 }), icon({ id: "c", size: 40 })];
    const next = runSizePatch(run, "a", { size2: 96 });
    expect(next[0].size2).toBe(96);
    expect(next[0].size).toBe(200);
    expect(next[1].size).toBe(96);
    /* a width is the part's own business */
    expect(runSizePatch(run, "a", { size: 240 })[1].size).toBe(40);
  });
});

describe("the chip's own size scale", () => {
  const chip = (patch: Partial<Item> = {}): Item => ({ ...makeItem("chip"), ...patch });

  it("keeps the 32dp chip M3 asks for, and the two roomier ones beside it", () => {
    expect(CHIP_SIZES.map((c) => c.h)).toEqual([32, 40, 56]);
    expect(chipMetrics(32)).toEqual({ h: 32, padX: 16, lead: 8, gap: 8, icon: 18, font: 14 });
    expect(chipMetrics(56)).toEqual({ h: 56, padX: 24, lead: 16, gap: 8, icon: 24, font: 16 });
    /* halfway from S (40) to M (56) */
    expect(chipMetrics(48)).toEqual({ h: 48, padX: 22, lead: 14, gap: 8, icon: 22, font: 15 });
  });

  it("stays inside the scale whatever height it is handed", () => {
    expect(chipHeightOf(chip())).toBe(CHIP_H_MIN);
    expect(chipHeightOf(chip({ size2: 1000 }))).toBe(CHIP_H_MAX);
    expect(chipHeightOf(chip({ size2: 4 }))).toBe(CHIP_H_MIN);
  });

  it("carries the height into the drawn box, keeping the width its label sets", () => {
    expect(sizeOf(chip({ size2: 56 }), { [chip().id]: 120 }).h).toBe(56);
    expect(sizeOf(chip(), {}).h).toBe(CHIP_H_MIN);
    /* a chip is as wide as its label makes it, so a measured width comes through untouched */
    expect(sizeOf({ ...chip(), id: "c" }, { c: 140 }).w).toBe(140);
  });

  it("ends a run as round as the chips in it are tall", () => {
    expect(connectSpecOf(chip())?.outer).toBe(16);
    expect(connectSpecOf(chip({ size2: 56 }))?.outer).toBe(28);
    /* the corner a lone chip keeps is the 8dp one M3 gives it, whatever its height */
    expect(baseRadii(chip({ size2: 56 })).tl).toBe(8);
  });
});

describe("a run of chips shares one measure", () => {
  const chip = (patch: Partial<Item> = {}): Item => ({ ...makeItem("chip"), id: "c", ...patch });

  it("hands the joining chip the height of the run that is standing still", () => {
    expect(matchRunSize(chip({ id: "a" }), chip({ size2: 56 })).size2).toBe(56);
    expect(matchRunSize(chip({ id: "a", size2: 56 }), chip()).size2).toBe(CHIP_H_MIN);
    /* one that already fits is left exactly as it was */
    const fits = chip({ id: "a", size2: 40 });
    expect(matchRunSize(fits, chip({ size2: 40 }))).toEqual(fits);
  });

  it("never mixes with the buttons, which are a run of their own", () => {
    expect(matchRunSize(chip(), { ...makeItem("button"), size2: 96 }).size2).toBeUndefined();
    expect(matchRunSize({ ...makeItem("button") }, chip({ size2: 56 })).size2).toBeUndefined();
  });

  it("carries a height across the run", () => {
    const run = [chip({ id: "a" }), chip({ id: "b" })];
    const next = runSizePatch(run, "a", { size2: 56 });
    expect(next.map((it) => it.size2)).toEqual([56, 56]);
  });
});

describe("a split button and its menu", () => {
  const split = (patch: Partial<Item> = {}): Item => ({ ...makeItem("splitButton"), id: "s", ...patch });

  it("is made of what a button of its height is made of, with a tighter arrow segment", () => {
    const m = splitMetrics(H);
    expect(m.trailPadX).toBe(Math.round(buttonMetrics(H).padX * 0.6));
    expect(m.trailW).toBe(m.icon + m.trailPadX * 2);
  });

  it("opens a menu only while it has entries to show", () => {
    expect(splitOpens(split({ tabs: [] }))).toBe(false);
    const withMenu = split({ tabs: [{ icon: "", label: "A" }, { icon: "", label: "B" }] });
    expect(splitOpens(withMenu)).toBe(true);
    expect(splitMenuHeight(withMenu)).toBe(2 * SPLIT_MENU_ITEM_H + SPLIT_MENU_PAD * 2);
  });

  it("drops its menu below the button where there is room, and raises it near the foot of a screen", () => {
    const it = split({ tabs: [{ icon: "", label: "A" }, { icon: "", label: "B" }, { icon: "", label: "C" }] });
    const frame = { id: "f", name: "Home", x: 0, y: 0 };
    expect(splitMenuRisesAt(it, 100, frame)).toBe(false);
    expect(splitMenuRisesAt(it, 800, frame)).toBe(true);
    /* off any screen, a menu drops the way a menu usually does */
    expect(splitMenuRisesAt(it, 800, null)).toBe(false);
  });

  it("keeps each entry's destination and the chosen one when the entries are reordered", () => {
    const it = split({
      tabs: [{ icon: "", label: "A" }, { icon: "", label: "B" }, { icon: "", label: "C" }],
      selected: 2,
      actions: { "tab:0": { to: "f1", transition: "slide" }, "tab:2": { to: "f3", transition: "fade" } },
    });
    const next = reorderTabsPatch(it, [2, 0, 1]);
    expect(next.tabs?.map((t) => t.label)).toEqual(["C", "A", "B"]);
    expect(next.selected).toBe(0);
    expect(next.actions).toEqual({ "tab:1": { to: "f1", transition: "slide" }, "tab:0": { to: "f3", transition: "fade" } });
  });
});

describe("a stack of list items", () => {
  const row = (patch: Partial<Item> = {}): Item => ({ ...makeItem("listItem"), ...patch });

  it("hands the joining item the width of the stack that is standing still", () => {
    expect(matchRunSize(row({ id: "a", size: 240 }), row({ size: 380 })).size).toBe(380);
    const fits = row({ id: "a", size: 380 });
    expect(matchRunSize(fits, row({ size: 380 }))).toEqual(fits);
  });

  it("carries a width across the stack", () => {
    const run = [row({ id: "a", size: 380 }), row({ id: "b", size: 380 })];
    expect(runSizePatch(run, "a", { size: 300 }).map((it) => it.size)).toEqual([300, 300]);
  });
});
