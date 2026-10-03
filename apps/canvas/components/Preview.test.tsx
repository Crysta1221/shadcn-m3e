import { isValidElement, type ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PALETTES, type Doc } from "../lib/tokens";
import { Preview } from "./Preview";

const hooks = vi.hoisted(() => ({
  refs: [] as { current: unknown }[],
  cursor: 0,
  effects: [] as (() => void | (() => void))[],
  present: true,
  peek: false,
}));
vi.mock("react", async (original) => ({
  ...await original<typeof import("react")>(),
  useState: (initial: unknown) => [hooks.peek && initial === null ? { frameId: "next", t: "slideLeft" } : typeof initial === "function" ? initial() : initial, vi.fn()],
  useRef: (current: unknown) => hooks.refs[hooks.cursor++] ?? (hooks.refs[hooks.cursor - 1] = { current }),
  useEffect: (effect: () => void | (() => void)) => { hooks.effects.push(effect); },
  useMemo: (value: () => unknown) => value(),
  useCallback: (callback: unknown) => callback,
}));
vi.mock("motion/react", () => ({
  AnimatePresence: "presence",
  motion: { div: "div", button: "button" },
  useReducedMotion: () => false,
  useIsPresent: () => hooks.present,
  useMotionValue: (value: number) => ({ get: () => value }),
  useTransform: () => 0,
}));
vi.mock("@/lib/tokens", () => import("../lib/tokens"));
vi.mock("@/lib/rail", () => import("../lib/rail"));
vi.mock("@/lib/railView", () => import("../lib/railView"));
vi.mock("@/lib/i18n", async () => ({ ...await import("../lib/i18n"), useLang: () => "en" }));
vi.mock("./M3Node", () => ({ M3Node: "node", Icon: "icon" }));
vi.mock("./ui", () => ({ IconBtn: "button" }));

const doc: Doc = {
  frame: "phone", paletteKey: "purple", title: "", brief: "",
  frames: [{ id: "first", name: "First", x: 0, y: 0, w: 1280, h: 800 }, { id: "next", name: "Next", x: 1400, y: 0, w: 1280, h: 800 }],
  groups: [0, 1400].map((x, i) => ({
    id: `group-${i}`, x, y: 0, axis: "y",
    items: [{ id: `rail-${i}`, kind: "navRail", label: "", icon: "menu", variant: "filled", railExpanded: true, railModal: true }],
  })),
};
type Element = ReactElement<Record<string, unknown>>;
function elements(node: unknown): Element[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!isValidElement<Record<string, unknown>>(node)) return [];
  return [node, ...elements(node.props.children)];
}

// Like Loading.test.tsx, inspect the actual elements and effect callbacks without
// a DOM runtime. Browser tests cover Motion's presence propagation and real focus.
function screenElement(peek = false) {
  hooks.peek = peek;
  const tree = Preview({ doc, widths: {}, palette: PALETTES[0], startId: "first", onClose: vi.fn() });
  const screens = elements(tree).filter((element) => typeof element.type === "function" && "frame" in element.props);
  hooks.peek = false;
  hooks.refs = [];
  // chosen by its prop rather than by position, so reordering the JSX cannot swap them
  const screen = screens.find((element) => (element.props.active === false) === peek);
  if (!screen) throw new Error(`no ${peek ? "peek" : "current"} screen rendered`);
  return screen;
}
function renderScreen(element: Element) {
  hooks.cursor = 0;
  hooks.effects = [];
  return (element.type as (props: Record<string, unknown>) => Element)(element.props);
}
function runEffects() {
  const cleanups = hooks.effects.map((effect) => effect());
  return () => cleanups.forEach((cleanup) => cleanup?.());
}

describe("preview screen modal lifecycle", () => {
  const previous = { isConnected: true, closest: vi.fn(), focus: vi.fn() };
  const toggle = { closest: () => ({}), focus: vi.fn(() => { documentState.activeElement = toggle; }) };
  const body = { closest: () => null };
  const documentState = { activeElement: previous as typeof previous | typeof toggle | typeof body | null, body };
  let previousInside = true;
  const host = { querySelector: vi.fn(() => toggle), contains: (element: unknown) => element === toggle || (element === previous && previousInside), focus: vi.fn() };
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();
  const attach = (tree: Element) => { (tree.props.ref as { current: unknown }).current = host; };

  beforeEach(() => {
    vi.clearAllMocks();
    hooks.refs = [];
    hooks.cursor = 0;
    hooks.effects = [];
    hooks.present = true;
    hooks.peek = false;
    previous.isConnected = true;
    previousInside = true;
    previous.closest.mockReturnValue(null);
    documentState.activeElement = previous;
    vi.stubGlobal("document", documentState);
    vi.stubGlobal("window", { addEventListener, removeEventListener });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("keeps the peek screen inert and free of modal side effects", () => {
    const element = screenElement(true);
    expect(element.props.active).toBe(false);
    const tree = renderScreen(element);
    attach(tree);
    const cleanup = runEffects();
    expect(tree.props).toMatchObject({ inert: true, "aria-hidden": true, role: "group", "aria-label": "Next" });
    expect(tree.props["aria-modal"]).toBeUndefined();
    expect(toggle.focus).not.toHaveBeenCalled();
    expect(host.focus).not.toHaveBeenCalled();
    expect(addEventListener).not.toHaveBeenCalled();
    cleanup();
    expect(previous.focus).not.toHaveBeenCalled();
    expect(host.focus).not.toHaveBeenCalled();
  });

  it.each(["nothing", "the body", "an inert subtree"])("takes focus itself when %s holds it as the screen on show", (holder) => {
    if (holder === "nothing") documentState.activeElement = null;
    else if (holder === "the body") documentState.activeElement = documentState.body;
    else previous.closest.mockReturnValue({});
    const element = screenElement();
    const tree = renderScreen({ ...element, props: { ...element.props, groups: [] } });
    attach(tree);
    runEffects();
    expect(tree.props).toMatchObject({ tabIndex: -1, role: "group", "aria-label": "First" });
    expect(host.focus).toHaveBeenCalledOnce();
    expect(toggle.focus).not.toHaveBeenCalled();
  });

  it("focuses and registers keyboard handling while the screen is active", () => {
    const element = screenElement();
    const tree = renderScreen(element);
    attach(tree);
    const cleanup = runEffects();
    expect(tree.props).toMatchObject({ inert: false, role: "dialog", "aria-modal": true });
    expect(toggle.focus).toHaveBeenCalledOnce();
    expect(addEventListener).toHaveBeenCalledWith("keydown", expect.any(Function), true);
    cleanup();
    expect(removeEventListener).toHaveBeenCalledWith("keydown", addEventListener.mock.calls[0][1], true);
  });

  it("deactivates a mounted modal without reclaiming focus when it exits", () => {
    const element = screenElement();
    attach(renderScreen(element));
    const cleanup = runEffects();
    expect(toggle.focus).toHaveBeenCalledOnce();
    expect(addEventListener).toHaveBeenCalledWith("keydown", expect.any(Function), true);
    const listener = addEventListener.mock.calls[0][1];
    vi.clearAllMocks();

    hooks.present = false;
    const exiting = renderScreen(element);
    expect(exiting.props).toMatchObject({ inert: true, "aria-hidden": true, role: "group" });
    expect(exiting.props["aria-modal"]).toBeUndefined();
    cleanup();
    expect(previous.focus).not.toHaveBeenCalled();
    expect(removeEventListener).toHaveBeenCalledWith("keydown", listener, true);
    const cleanupExiting = runEffects();
    expect(toggle.focus).not.toHaveBeenCalled();
    expect(addEventListener).not.toHaveBeenCalled();
    cleanupExiting();
    expect(previous.focus).not.toHaveBeenCalled();
  });

  it.each(["connected", "outside", "inert", "disconnected"])("restores a %s previous target only when safe on modal dismissal", (status) => {
    const element = screenElement();
    attach(renderScreen(element));
    const cleanup = runEffects();
    previous.isConnected = status !== "disconnected";
    previousInside = status !== "outside";
    previous.closest.mockReturnValue(status === "inert" ? {} : null);
    renderScreen({ ...element, props: { ...element.props, groups: [] } });
    cleanup();
    expect(previous.focus).toHaveBeenCalledTimes(status === "connected" ? 1 : 0);
    // an unusable previous target hands the keyboard to the screen itself, never to the body
    expect(host.focus).toHaveBeenCalledTimes(status === "connected" ? 0 : 1);
  });
});
