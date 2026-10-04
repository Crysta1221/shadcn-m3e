import { describe, expect, it } from "vitest";
import { appearanceOf, applyAppearance } from "./appearance";
import { h } from "./node";

describe("appearanceOf", () => {
  it("reads the item's look, or nothing when it has none", () => {
    expect(appearanceOf({})).toBeUndefined();
    expect(appearanceOf({ fill: "primaryContainer" })).toEqual({ fill: "primaryContainer", text: undefined, corners: undefined });
    expect(appearanceOf({ textColor: "primary" })).toEqual({ fill: undefined, text: "primary", corners: undefined });
    expect(appearanceOf({ corners: { tl: 4, tr: 4, bl: 4, br: 4 } })).toEqual({ corners: { tl: 4, tr: 4, bl: 4, br: 4 } });
  });
});

describe("applyAppearance", () => {
  const card = () => h("Card", { variant: "filled", style: { width: 280 } }, h("CardHeader", null, "T"));

  it("leaves the tree alone when there is no appearance", () => {
    const tree = card();
    expect(applyAppearance(tree, undefined)).toBe(tree);
  });

  it("paints the root with the fill and its on-colour", () => {
    const out = applyAppearance(card(), { fill: "primaryContainer" });
    expect(out.props?.className).toBe("bg-primary-container text-on-primary-container");
  });

  it("replaces the palette classes the target already has, keeping the rest", () => {
    const slide = h("div", { className: "flex items-center rounded-2xl text-headline-large bg-secondary-container text-on-secondary-container" });
    const out = applyAppearance(slide, { fill: "tertiaryContainer", text: "onSurface" });
    expect(out.props?.className).toBe("flex items-center rounded-2xl text-headline-large bg-tertiary-container text-on-surface");
  });

  it("lets a text role stand on its own without a fill", () => {
    const out = applyAppearance(card(), { text: "primary" });
    expect(out.props?.className).toBe("text-primary");
  });

  it("sets the four corners on the style, merged with what is there", () => {
    const out = applyAppearance(card(), { corners: { tl: 24, tr: 24, bl: 0, br: 0 } });
    expect(out.props?.style).toEqual({ width: 280, borderRadius: "24px 24px 0px 0px" });
  });

  it("paints only the nodes whose type the part names", () => {
    const tree = h("Sheet", null, h("SheetContent", null, h("SheetTitle", null, "T")));
    const out = applyAppearance(tree, { fill: "surfaceContainerHighest" }, "SheetContent");
    expect(out.props?.className).toBeUndefined();
    const content = out.children![0];
    expect(typeof content === "string" ? "" : content.props?.className).toBe("bg-surface-container-highest text-on-surface");
  });

  it("paints every node of the named types", () => {
    const tree = h(
      "Carousel",
      null,
      h("CarouselItem", null, h("div", { className: "bg-primary-container" }, "1")),
      h("CarouselItem", null, h("div", { className: "bg-secondary-container" }, "2")),
    );
    const out = applyAppearance(tree, { fill: "inverseSurface" }, "div");
    for (const c of out.children ?? []) {
      const slide = (typeof c === "string" ? [] : c.children ?? [])[0];
      expect(typeof slide === "string" ? "" : slide?.props?.className).toBe("bg-inverse-surface text-inverse-on-surface");
    }
  });
});
