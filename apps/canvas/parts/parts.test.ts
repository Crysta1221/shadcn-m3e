import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { COMPONENTS, FILE_OF } from "./components";
import { EXTERNAL } from "./externals";
import { h, ic, raw } from "./node";
import { readFileSync } from "node:fs";
import { importLines, itemOfFile, itemsOf, namesIn, printNode } from "./print";
import { renderNode } from "./render";
import { PARTS, defaultValues, partBySlug, treeOf, viewOf } from "./registry";

/* some components read the viewport while they render (the sidebar); a browser would have one */
beforeAll(() => {
  vi.stubGlobal("window", { innerWidth: 1280, matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
});

describe("the part registry", () => {
  it("gives every part a unique slug and unique prop keys", () => {
    expect(new Set(PARTS.map((d) => d.slug)).size).toBe(PARTS.length);
    for (const d of PARTS) expect(new Set(d.props.map((p) => p.key)).size, d.slug).toBe(d.props.length);
  });

  it("keeps every default inside what its prop allows", () => {
    for (const d of PARTS)
      for (const p of d.props) {
        if (p.kind === "enum") expect(p.options.map((o) => (typeof o === "string" ? o : o.value)), `${d.slug}.${p.key}`).toContain(p.default);
        if (p.kind === "number") expect(p.default >= p.min && p.default <= p.max, `${d.slug}.${p.key}`).toBe(true);
      }
  });

  it("falls back to the default for a missing or wrong value", () => {
    const button = partBySlug("button")!;
    expect(treeOf(button, { variant: "nope", size: 3 }).props?.variant).toBe("filled");
    expect(treeOf(button, { variant: "tonal" }).props?.variant).toBe("tonal");
  });

  it("names only components that exist", () => {
    for (const d of PARTS)
      for (const name of namesIn(treeOf(d, defaultValues(d)))) expect(FILE_OF[name] ?? EXTERNAL[name], `${d.slug}: ${name}`).toBeTruthy();
  });

  it("draws every part with its real components", () => {
    for (const d of PARTS) {
      const html = renderToStaticMarkup(createElement("div", null, renderNode(treeOf(d, defaultValues(d)))));
      expect(html.length, d.slug).toBeGreaterThan(20);
      expect(html, d.slug).not.toMatch(/undefined|\[object/);
    }
  });
});

describe("components", () => {
  it("finds the shadcn M3E components by name", () => {
    expect(COMPONENTS.Button).toBeTruthy();
    expect(FILE_OF.Button).toBe("button");
    expect(FILE_OF.ExtendedFab).toBe("fab");
    expect(FILE_OF.toast).toBe("sonner");
  });
});

describe("printNode", () => {
  it("prints a short element on one line", () => {
    expect(printNode(treeOf(partBySlug("button")!)).join("\n")).toBe(`<Button variant="filled" size="sm">Button</Button>`);
  });

  it("prints an icon inside a button and drops undefined and false props", () => {
    const tree = h("Button", { variant: "tonal", shape: undefined, disabled: false }, ic("add"), "Add");
    expect(printNode(tree)).toEqual([`<Button variant="tonal" disabled={false}><Icon name="add" />Add</Button>`]);
  });

  it("breaks a long element into one attribute and one child per line", () => {
    const lines = printNode(treeOf(partBySlug("app-bar")!, { title: "A rather long title for a bar", subtitle: "and a subtitle to go with it" }));
    expect(lines[0]).toBe("<AppBar");
    expect(lines.at(-1)).toBe("/>");
    expect(lines.some((l) => l.startsWith('  title="A rather long title for a bar"'))).toBe(true);
  });

  it("escapes braces and angles in text and prints values as expressions", () => {
    expect(printNode(h("p", null, "a < b {c}"))).toEqual([`<p>{"a < b {c}"}</p>`]);
    expect(printNode(h("Slider", { defaultValue: [50], items: [{ value: "a", label: "A" }] }))).toEqual([`<Slider defaultValue={[50]} items={[{ value: "a", label: "A" }]} />`]);
  });

  it("prints raw code as it is and counts what it uses", () => {
    const node = h("Button", { onClick: raw(`() => toast("Saved")`, "toast") }, "Save");
    expect(printNode(node)).toEqual([`<Button onClick={() => toast("Saved")}>Save</Button>`]);
    expect([...namesIn(node)]).toEqual(["Button", "toast"]);
  });
});

describe("imports", () => {
  it("prints one import per file, sorted, and the registry items to add", () => {
    const names = new Set(["Icon", "Button", "FilterChip", "Chip"]);
    expect(importLines(names)).toEqual([
      `import { Button } from "@/components/m3e/button"`,
      `import { Chip, FilterChip } from "@/components/m3e/chip"`,
      `import { Icon } from "@/components/m3e/icon"`,
    ]);
    expect(itemsOf(names)).toEqual(["button", "chip", "icon"]);
  });
});

describe("registry items", () => {
  it("installs every module file from an item the registry has", () => {
    const meta = readFileSync(new URL("../../docs/src/docs/registry-meta.generated.ts", import.meta.url), "utf8");
    const items = new Set([...meta.matchAll(/^ {2}"([^"]+)": \{/gm)].map((m) => m[1]));
    expect(items.size).toBeGreaterThan(60);
    for (const file of new Set(Object.values(FILE_OF))) expect(items.has(itemOfFile(file)), file).toBe(true);
  });
});

describe("the canvas view of a part", () => {
  it("draws every part, open where it opens something", () => {
    for (const d of PARTS) {
      const html = renderToStaticMarkup(createElement("div", null, renderNode(viewOf(d, defaultValues(d)))));
      expect(html.length, d.slug).toBeGreaterThan(20);
      expect(html, d.slug).not.toMatch(/undefined|\[object/);
    }
  });

  it("puts a part that opens something in a box, and prints it closed", () => {
    const dialog = partBySlug("dialog")!;
    expect(viewOf(dialog).type).toBe("Contained");
    expect(treeOf(dialog).type).toBe("Dialog");
    expect(printNode(treeOf(dialog)).join("\n")).not.toContain("defaultOpen");
    expect(partBySlug("button")).toBeTruthy();
    expect(viewOf(partBySlug("button")!).type).toBe("Button");
  });
});
