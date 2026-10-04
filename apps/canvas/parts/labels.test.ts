import { describe, expect, it } from "vitest";

import { COMMON_TEXT, choiceLabelOf, defaultTextOf, labelOf, nameOf } from "./labels";
import { PARTS } from "./registry";
import { LANGS } from "../lib/i18n";

/* What the author reads — a part's name in the palette and its prop labels in the panel —
 * is never left in English when the editor speaks another language. Enum option *values*
 * are code (`filled`, `primary-container`) and stay; only the words meant to be read are
 * asserted here. */

describe("the parts' own words", () => {
  it("calls every part by name in every language", () => {
    for (const d of PARTS)
      for (const l of LANGS.filter((x) => x.key !== "en")) {
        const name = nameOf(d, l.key);
        expect(name, `${d.slug} (${l.key})`).toBeTruthy();
        expect(name, `${d.slug} is still English in ${l.key}`).not.toBe(d.name);
      }
  });

  it("names every prop label in every language", () => {
    const missing: string[] = [];
    for (const d of PARTS)
      for (const p of d.props)
        for (const l of LANGS.filter((x) => x.key !== "en")) if (labelOf(p, l.key) === p.label) missing.push(`${d.slug}.${p.key}: "${p.label}" (${l.key})`);
    expect(missing).toEqual([]);
  });

  it("reads an enum choice by its label in the editor's language", () => {
    expect(choiceLabelOf({ value: "basic", label: "Basic" }, "ja")).toBe("基本");
    expect(choiceLabelOf({ value: "basic", label: "Basic" }, "zh")).toBe("基本");
    /* a bare string is a code value; a word the author reads still translates */
    expect(choiceLabelOf("filled", "ja")).toBe("塗りつぶし");
    expect(choiceLabelOf("primary-container", "ja")).toBe("primary-container");
  });

  it("seeds shared text in the editor's language", () => {
    expect(COMMON_TEXT["Cancel"]?.ja).toBe("キャンセル");
    expect(defaultTextOf({ key: "x", label: "x", kind: "text", default: "Cancel" }, "ja")).toBe("キャンセル");
    expect(defaultTextOf({ key: "x", label: "x", kind: "text", default: "Cancel" }, "en")).toBe("Cancel");
    /* a seed of the part's own wins over the common one */
    expect(defaultTextOf({ key: "x", label: "x", kind: "text", default: "Cancel", defaults: { ja: "やめる" } }, "ja")).toBe("やめる");
  });
});
