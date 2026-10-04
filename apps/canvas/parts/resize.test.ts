import { beforeAll, describe, expect, it } from "vitest";

import { setGlobalLang } from "../lib/i18n";
import { partBySlug } from "./registry";
import { labelOfPart } from "./resize";

beforeAll(() => setGlobalLang("en"));

const name = (slug: string, props?: Record<string, unknown>) => labelOfPart(partBySlug(slug), props);

describe("labelOfPart", () => {
  it("calls a part by its heading or label", () => {
    expect(name("button", { label: "Save" })).toBe("Save");
    expect(name("app-bar", { title: "Inbox" })).toBe("Inbox");
    expect(name("dialog", { title: "Reset settings?" })).toBe("Reset settings?");
  });

  it("calls an item by its row, not by the description under it", () => {
    expect(name("item", { items: [{ label: "Inbox" }], description: "12 new messages" })).toBe("Inbox");
  });

  it("falls back to the description, then to nothing", () => {
    expect(name("item", { items: [{ label: "" }], description: "Only words" })).toBe("Only words");
    expect(name("separator")).toBe("");
  });

  it("calls a button group or a bar by its first row", () => {
    expect(name("button-group", { items: [{ label: "Rewind" }, { label: "Play" }] })).toBe("Rewind");
    expect(name("navigation-bar", { items: [{ label: "Home" }] })).toBe("Home");
  });

  it("shortens long words", () => {
    expect(name("button", { label: "A very long label that does not fit" })).toBe("A very long label that …");
  });
});
