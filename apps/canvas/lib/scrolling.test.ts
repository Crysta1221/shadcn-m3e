import { beforeAll, describe, expect, it } from "vitest";
import { scrollingDoc } from "./codegen.fixture";
import { buildCode } from "./codegen";
import { migrateLegacy, revertPatch } from "./migrate";
import { setGlobalLang } from "./i18n";
import { buildPrompt } from "./prompt";
import { pinOf, stretchFrame, carryFrame } from "./tidy";
import { canCollapseFab, makeItem, PHONE_H, type Group, type Item } from "./tokens";

beforeAll(() => setGlobalLang("en"));
const converted = () => {
  const doc = scrollingDoc();
  doc.groups = doc.groups.map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, ...migrateLegacy(it)?.patch })) }));
  return doc;
};

describe("long screens with real components", () => {
  it("pins a real navigation bar at the foot and leaves body content scrollable", () => {
    const doc = converted();
    const f = doc.frames[0];
    expect(pinOf(doc.groups.find((g) => g.id === "nav")!, f, {})).toBe("foot");
    expect(pinOf(doc.groups.find((g) => g.id === "body")!, f, {})).toBeNull();
    const out = stretchFrame(doc.groups, f, PHONE_H * 3, doc.frames, {});
    expect(out.groups.find((g) => g.id === "nav")!.y).toBe(doc.groups.find((g) => g.id === "nav")!.y + PHONE_H);
    expect(out.groups.find((g) => g.id === "body")!.y).toBe(1200);
  });

  it("extends a real rail and keeps its identity and destinations", () => {
    const doc = converted();
    const f = doc.frames[0];
    const rail: Item = { ...makeItem("component", "navigation-rail"), id: "rail", props: { height: PHONE_H, items: [{ label: "Inbox", icon: "inbox" }] } };
    const g: Group = { id: "rail", x: 0, y: 0, axis: "y", items: [rail] };
    const out = stretchFrame([g], f, PHONE_H * 3, [f], {});
    expect(out.groups[0].items[0].props?.height).toBe(PHONE_H * 3);
    expect(out.groups[0].items[0].component).toBe("navigation-rail");
    expect(out.groups[0].items[0].props?.items).toEqual(rail.props?.items);
    const carried = carryFrame(out.groups, out.frames[0], { ...out.frames[0], w: 1280, h: 800 }, out.frames, {});
    expect(carried.groups[0].items[0].component).toBe("navigation-rail");
  });

  it("keeps the scroll option through conversion and reverting", () => {
    const old = scrollingDoc().groups.find((g) => g.id === "fab")!.items[0];
    const item = { ...old, ...migrateLegacy(old)!.patch };
    expect(canCollapseFab(item)).toBe(true);
    expect(item.collapseOnScroll).toBe(true);
    expect(revertPatch(item)!.patch.collapseOnScroll).toBe(true);
  });

  it.each([false, true])("exports working scroll and folding state (converted: %s)", (real) => {
    const doc = real ? converted() : scrollingDoc();
    const { code } = buildCode(doc, {});
    expect(code).toContain('overflow-y-auto');
    expect(code).toContain('height: 1784');
    expect(code).toContain('collapsed={fabFolded}');
    expect(code).toContain('setFabFolded(top > lastScrollTop.current)');
    expect(code).toContain(real ? 'top-[788px]' : 'bottom-0');
    expect(code).not.toContain('undefined');
    const prompt = buildPrompt(doc, {}, undefined, "en");
    expect(prompt).toContain('scrolls down');
    doc.frames[0].length = undefined;
    expect(buildCode(doc, {}).code).not.toContain('setFabFolded');
    expect(buildPrompt(doc, {}, undefined, "en")).not.toContain('scrolls down');
  });
});
