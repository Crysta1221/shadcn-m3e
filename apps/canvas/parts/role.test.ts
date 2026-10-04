import { describe, expect, it } from "vitest";
import { fullWidth, roleOf } from "./role";

describe("roleOf", () => {
  it("maps the legacy kinds to their roles", () => {
    expect(roleOf({ kind: "topAppBar" })).toBe("top");
    expect(roleOf({ kind: "bottomNav" })).toBe("bottom");
    expect(roleOf({ kind: "navRail" })).toBe("rail");
    expect(roleOf({ kind: "snackbar" })).toBe("floatingBottom");
    expect(roleOf({ kind: "fab" })).toBe("fab");
    expect(roleOf({ kind: "dialog" })).toBe("overlay");
    expect(roleOf({ kind: "text" })).toBe("label");
    expect(roleOf({ kind: "switch" })).toBe("control");
    expect(roleOf({ kind: "carousel" })).toBe("fullWidth");
    expect(roleOf({ kind: "listItem" })).toBe("listLike");
  });

  it("answers undefined for the legacy kinds that belong in the body", () => {
    expect(roleOf({ kind: "button" })).toBeUndefined();
    expect(roleOf({ kind: "box" })).toBeUndefined();
  });

  it("reads a component's role from its PartDef", () => {
    expect(roleOf({ kind: "component", component: "navigation-bar" })).toBe("bottom");
    expect(roleOf({ kind: "component", component: "app-bar" })).toBe("top");
    expect(roleOf({ kind: "component", component: "navigation-rail" })).toBe("rail");
    expect(roleOf({ kind: "component", component: "dialog" })).toBe("overlay");
    expect(roleOf({ kind: "component", component: "button" })).toBeUndefined();
  });

  it("resolves dynamic roles from the props", () => {
    expect(roleOf({ kind: "component", component: "toolbar", props: { kind: "floating" } })).toBe("floatingBottom");
    expect(roleOf({ kind: "component", component: "toolbar", props: { kind: "docked" } })).toBe("bottom");
  });

  it("answers undefined for an unknown component slug", () => {
    expect(roleOf({ kind: "component", component: "no-such-part" })).toBeUndefined();
  });
});

describe("fullWidth", () => {
  it("spans edge to edge for top bars, the carousel and the navigation bar", () => {
    expect(fullWidth({ kind: "topAppBar" })).toBe(true);
    expect(fullWidth({ kind: "component", component: "app-bar" })).toBe(true);
    expect(fullWidth({ kind: "component", component: "tabs" })).toBe(true);
    expect(fullWidth({ kind: "carousel" })).toBe(true);
    expect(fullWidth({ kind: "bottomNav" })).toBe(true);
    expect(fullWidth({ kind: "component", component: "navigation-bar" })).toBe(true);
  });

  it("keeps its own width for bottom parts that are not the navigation bar", () => {
    expect(fullWidth({ kind: "bottomSheet" })).toBe(false);
    expect(fullWidth({ kind: "component", component: "drawer" })).toBe(false);
    expect(fullWidth({ kind: "component", component: "toolbar", props: { kind: "docked" } })).toBe(false);
  });

  it("is false for body parts", () => {
    expect(fullWidth({ kind: "component", component: "button" })).toBe(false);
    expect(fullWidth({ kind: "card" })).toBe(false);
  });
});
