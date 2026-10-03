/**
 * The prompt's outline and its optional guidance lines.
 *
 * Locks in:
 *  - promptMarks finds one mark per heading and one per screen, in every language, and keeps
 *    two screens with one name apart
 *  - a document with no choices reads exactly as it did before the choices existed
 *  - the deliverable line is on by default and can be switched off
 */
import { describe, expect, it } from "vitest";
import { DEFAULT_PROMPT_OPTIONS, buildPrompt, isPromptOption, promptMarks, promptOptionsOf } from "./prompt";
import { LANGS as LANG_LIST } from "./i18n";
const LANGS = LANG_LIST.map(({ key }) => key);
import { DEFAULT_THEME, Doc, makeItem } from "./tokens";

const doc = (patch: Partial<Doc> = {}): Doc => ({
  title: "Notes",
  brief: "",
  paletteKey: "purple",
  frame: "phone",
  platform: "android",
  theme: DEFAULT_THEME,
  frames: [
    { id: "f1", name: "Home", x: 0, y: 0 },
    { id: "f2", name: "Home", x: 500, y: 0 },
    { id: "f3", name: "", x: 1000, y: 0 },
  ],
  groups: [{ id: "g", x: 16, y: 100, axis: "x", items: [{ ...makeItem("button"), id: "b", label: "Open" }] }],
  ...patch,
});

describe("promptMarks", () => {
  it.each(LANGS)("marks every heading and every screen in %s", (lang) => {
    const d = doc();
    const text = buildPrompt(d, {}, undefined, lang);
    const marks = promptMarks(text, d.frames, lang);
    const headings = text.split("\n").filter((l) => l.startsWith("## ")).length;
    expect(marks.filter((m) => m.kind === "section")).toHaveLength(headings);
    const screens = marks.filter((m) => m.kind === "screen");
    expect(screens.map((m) => m.frameId)).toEqual(["f1", "f2", "f3"]);
    /* each mark points at a line that begins the stretch it names */
    for (const m of marks) expect(text.split("\n")[m.line].length).toBeGreaterThan(0);
  });

  it("finds nothing in a text without the prompt's shape", () => {
    expect(promptMarks("just words", doc().frames, "en")).toEqual([]);
  });
});

describe("prompt options", () => {
  it("defaults to the deliverable line and honours an empty choice", () => {
    expect(promptOptionsOf({})).toEqual(DEFAULT_PROMPT_OPTIONS);
    expect(promptOptionsOf({ promptOptions: [] })).toEqual([]);
    expect(promptOptionsOf({ promptOptions: ["tests", "nonsense"] })).toEqual(["tests"]);
    expect(isPromptOption("darkMode")).toBe(true);
    expect(isPromptOption("apk")).toBe(false);
  });

  it.each(LANGS)("keeps the deliverable line at the end unless it is switched off, in %s", (lang) => {
    const on = buildPrompt(doc(), {}, undefined, lang);
    const off = buildPrompt(doc({ promptOptions: [] }), {}, undefined, lang);
    expect(on).toMatch(/release APK/);
    expect(off).not.toMatch(/release APK/);
    /* the choice only ever adds lines at the very end */
    expect(on.startsWith(off)).toBe(true);
  });
});
