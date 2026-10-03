"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PromptMark, buildPrompt, promptMarks } from "@/lib/prompt";
import { Doc, Palette, Platform, defaultPlatformOf } from "@/lib/tokens";
import { Icon } from "./M3Node";
import { Field, IconBtn, Segmented } from "./ui";
import { t, useLang } from "@/lib/i18n";

/* The prompt tab: what the sketch says to a model, and the few things said about the app as a
 * whole. In the panel the prompt is read, not written: its box carries a pen that opens it full
 * screen, beside the button that copies it. Full screen, the text is edited with the room it
 * needs, an outline of its headings and screens stands beside it -- a tap lights that stretch
 * and scrolls to it -- and the app's name and its brief sit on the left. */

/** the text's own measures */
const FONT = 13;
const LINE = 1.75;
const PAD = 14;
/** how far the text's top edge fades into the box around it */
const FADE = 22;
/** the room the buttons in the box's corner need under the last line */
const FOOT = 60;
/** how long the full-screen cover takes to grow out of the panel, and to shrink back */
const COVER_MS = 320;
const COVER_EASE = "cubic-bezier(0.2, 0, 0, 1)";
/** the panel's own top padding: the target stands this far under the panel's top */
const PANEL_PAD_TOP = 28;
/** how long the reset button takes to fade before the box narrows on the way out */
const RESET_FADE_MS = 120;

/** where each line of the text begins, as offsets into it, with the text's end as the last */
function lineStartsOf(text: string): number[] {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
  starts.push(text.length + 1);
  return starts;
}

/** which stretch of the text a mark owns: from its line to the line before the next mark */
function rangeOf(starts: number[], marks: PromptMark[], i: number): [number, number] {
  const start = starts[Math.min(marks[i].line, starts.length - 1)];
  const next = marks[i + 1]?.line ?? starts.length - 1;
  const end = starts[Math.min(next, starts.length - 1)] - 1;
  return [start, Math.max(start, end)];
}

/** the mark whose stretch holds a place in the text, or -1 before the first */
function markAt(starts: number[], marks: PromptMark[], at: number): number {
  let lo = 0;
  let hi = marks.length - 1;
  let hit = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (rangeOf(starts, marks, mid)[0] <= at) {
      hit = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return hit;
}

/** the outline: the sections as rows, the screens indented under the layout section */
function Outline({ marks, current, onPick, p }: { marks: PromptMark[]; current: number; onPick: (i: number) => void; p: Palette }) {
  const lang = useLang();
  return (
    <ul aria-label={t("outline", lang)} className="no-scrollbar" style={{ display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", minHeight: 0, margin: 0, padding: 0, listStyle: "none" }}>
      {marks.map((m, i) => {
        const on = i === current;
        const screen = m.kind === "screen";
        return (
          <li key={i} style={{ display: "flex" }}>
          <button
            onClick={() => onPick(i)}
            title={m.label}
            className="m3-press"
            aria-current={on ? "true" : undefined}
            style={{
              height: 36,
              padding: `0 12px 0 ${screen ? 28 : 12}px`,
              borderRadius: 18,
              border: "none",
              background: on ? p.secondaryContainer : "transparent",
              color: on ? p.onSecondaryContainer : screen ? p.onSurface : p.onSurfaceVariant,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              flex: "0 0 auto",
              maxWidth: "100%",
              textAlign: "start",
              transition: "background 160ms",
            }}
          >
            <Icon name={screen ? "smartphone" : "tag"} size={18} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.label}</span>
          </button>
          </li>
        );
      })}
    </ul>
  );
}

/** the width the copy button keeps, in the panel and full screen alike */
const COPY_W = 200;

/** The copy button, in a slow drift of the theme's colours: the one thing here that leaves the
 *  editor. Tapped, it keeps its look and its width and shows only a check for a moment. */
function CopyButton({ copied, onClick, p }: { copied: boolean; onClick: () => void; p: Palette }) {
  const lang = useLang();
  return (
    <button
      onClick={onClick}
      className="m3-press"
      title={t("copyPrompt", lang)}
      style={{
        width: COPY_W,
        height: 44,
        borderRadius: 22,
        border: "none",
        backgroundImage: `linear-gradient(120deg, ${p.primary}, ${p.secondary}, ${p.primary}, ${p.secondary})`,
        backgroundSize: "300% 300%",
        animation: "m3e-drift 4s ease-in-out infinite",
        color: p.onPrimary,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        padding: 0,
        flex: "0 0 auto",
        whiteSpace: "nowrap",
      }}
    >
      {/* both faces are laid out, so the button keeps one width while it flips */}
      <span style={{ gridArea: "1 / 1", display: "inline-flex", alignItems: "center", gap: 8, visibility: copied ? "hidden" : "visible" }}>
        <Icon name="content_copy" size={20} />
        {t("copyPrompt", lang)}
      </span>
      <span style={{ gridArea: "1 / 1", display: "inline-flex", visibility: copied ? "visible" : "hidden" }}>
        <Icon name="check" size={22} />
      </span>
    </button>
  );
}

/** a few lines of text in a rounded box, fading at the top and the bottom as they scroll past */
function FadeArea({ value, onChange, placeholder, p, rows = 5 }: { value: string; onChange: (v: string) => void; placeholder: string; p: Palette; rows?: number }) {
  const fade = (top: boolean): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    right: 0,
    [top ? "top" : "bottom"]: 0,
    height: 18,
    background: `linear-gradient(to ${top ? "bottom" : "top"}, ${p.surfaceContainerHigh}, ${p.surfaceContainerHigh}00)`,
    pointerEvents: "none",
  });
  return (
    <div style={{ position: "relative", borderRadius: 18, background: p.surfaceContainerHigh, overflow: "hidden" }}>
      <textarea
        className="no-scrollbar"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        rows={rows}
        style={{ display: "block", width: "100%", border: "none", background: "transparent", color: p.onSurface, fontSize: 14, lineHeight: 1.6, fontFamily: "inherit", padding: "14px 16px", resize: "none", outline: "none", boxSizing: "border-box" }}
      />
      <div style={fade(true)} />
      <div style={fade(false)} />
    </div>
  );
}

/** The text in its box, with a fade at the top and the bottom so what scrolls past dissolves
 *  rather than being cut, and the buttons about it fixed in the corner under the text. Under
 *  the text lies a copy of it drawn in no colour, on which the stretch picked in the outline is
 *  painted: the text itself stays free to edit. Read-only, it is the same box with no caret. */
function PromptBox({
  text,
  starts,
  marks,
  lit,
  jump,
  onText,
  onCaret,
  p,
  areaRef,
  corner,
  readOnly,
}: {
  text: string;
  /** where the text's lines begin, computed once per text */
  starts: number[];
  marks: PromptMark[];
  lit: number;
  /** counts up each time the outline asks the text to scroll to the lit stretch */
  jump: number;
  onText: (v: string) => void;
  onCaret: (at: number) => void;
  p: Palette;
  areaRef: React.RefObject<HTMLTextAreaElement | null>;
  /** the buttons in the box's lower corner */
  corner: React.ReactNode;
  readOnly?: boolean;
}) {
  const lang = useLang();
  const under = useRef<HTMLDivElement | null>(null);
  const mark = useRef<HTMLSpanElement | null>(null);
  /** the box drawn behind the lit stretch: from its first line's top to its last line's bottom */
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);
  const measure = () => {
    const el = mark.current;
    const host = under.current;
    if (!el || !host || lit < 0) {
      setBox(null);
      return;
    }
    const rects = Array.from(el.getClientRects());
    if (!rects.length) {
      setBox(null);
      return;
    }
    const base = host.getBoundingClientRect().top - host.scrollTop;
    const top = Math.min(...rects.map((r) => r.top)) - base;
    const bottom = Math.max(...rects.map((r) => r.bottom)) - base;
    setBox({ top: top - 4, height: bottom - top + 8 });
  };
  /* the observer outlives every render, so it reads the measure of the render it fires in */
  const measureRef = useRef(measure);
  measureRef.current = measure;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(measure, [lit, text, marks]);
  useEffect(() => {
    const host = under.current;
    if (!host) return;
    const ro = new ResizeObserver(() => measureRef.current());
    ro.observe(host);
    return () => ro.disconnect();
  }, []);
  const sync = () => {
    if (under.current && areaRef.current) under.current.scrollTop = areaRef.current.scrollTop;
  };
  /* the lit stretch is scrolled to where it stands in the copy under the text, which knows how
   * the lines wrap; a little room is left above it so its heading is not under the fade */
  useEffect(() => {
    const el = mark.current;
    const host = under.current;
    if (!jump || !el || !host || !areaRef.current) return;
    const rect = el.getClientRects()[0];
    if (!rect) return;
    const top = rect.top - host.getBoundingClientRect().top + host.scrollTop;
    areaRef.current.scrollTo({ top: Math.max(0, top - FADE - 4), behavior: "smooth" });
  }, [jump, areaRef]);
  const caret = () => areaRef.current && onCaret(areaRef.current.selectionStart);
  const [a, b] = lit >= 0 && lit < marks.length ? rangeOf(starts, marks, lit) : [0, 0];
  /* both layers keep the room a scrollbar takes, so the copy wraps where the text does even
   * when only the text has a scrollbar to show */
  const type: React.CSSProperties = { fontSize: FONT, lineHeight: LINE, fontFamily: "inherit", whiteSpace: "pre-wrap", wordBreak: "break-word", padding: `${PAD}px ${PAD}px ${FOOT}px`, boxSizing: "border-box", scrollbarGutter: "stable" };
  const fade = (top: boolean): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    right: 0,
    [top ? "top" : "bottom"]: 0,
    height: top ? FADE : FOOT,
    background: `linear-gradient(to ${top ? "bottom" : "top"}, ${p.surfaceContainerLow} ${top ? "0%" : "45%"}, ${p.surfaceContainerLow}00)`,
    pointerEvents: "none",
    zIndex: 2,
  });
  return (
    <div style={{ position: "relative", flex: 1, minHeight: 0, borderRadius: 18, background: p.surfaceContainerLow, overflow: "hidden" }}>
      <div ref={under} aria-hidden className="no-scrollbar" style={{ position: "absolute", inset: 0, overflow: "hidden", color: "transparent", ...type }}>
        {box && <span style={{ position: "absolute", left: PAD - 6, right: PAD - 6, top: box.top, height: box.height, borderRadius: 10, background: p.secondaryContainer, transition: "top 160ms, height 160ms" }} />}
        <span style={{ position: "relative" }}>
          {text.slice(0, a)}
          {lit >= 0 && <span ref={mark}>{text.slice(a, b)}</span>}
          {text.slice(b)}
          {"\n"}
        </span>
      </div>
      <textarea
        ref={areaRef}
        className="no-scrollbar"
        value={text}
        readOnly={readOnly}
        onChange={(e) => onText(e.target.value)}
        onScroll={sync}
        onSelect={caret}
        onKeyUp={caret}
        onClick={caret}
        spellCheck={false}
        aria-label={t("prompt", lang)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", background: "transparent", color: p.onSurface, resize: "none", outline: "none", cursor: readOnly ? "default" : undefined, ...type }}
      />
      <div style={fade(true)} />
      <div style={fade(false)} />
      <div style={{ position: "absolute", left: 8, right: 8, bottom: 8, zIndex: 3, display: "flex" }}>{corner}</div>
    </div>
  );
}

export function PromptPanel({
  doc,
  widths,
  palette: p,
  onDoc,
  onCover,
}: {
  doc: Doc;
  widths: Record<string, number>;
  palette: Palette;
  onDoc: (patch: Partial<Doc>) => void;
  /** told when the full-screen cover has opened, and when it starts to close */
  onCover?: (up: boolean) => void;
}) {
  const lang = useLang();
  const generated = useMemo(() => buildPrompt(doc, widths, undefined, lang), [doc, widths, lang]);
  const edited = doc.promptEdit !== undefined;
  const text = edited ? doc.promptEdit! : generated;
  const marks = useMemo(() => promptMarks(text, doc.frame === "phone" ? doc.frames : [], lang), [text, doc.frames, doc.frame, lang]);
  const starts = useMemo(() => lineStartsOf(text), [text]);
  const [copied, setCopied] = useState(false);
  /** the full-screen cover: gone, or up -- and whether it has grown to the whole window yet */
  const [cover, setCover] = useState<"off" | "on" | "closing">("off");
  const [grown, setGrown] = useState(false);
  /** on the way out, the text box takes the panel's width -- a beat after the reset has faded */
  const [narrow, setNarrow] = useState(false);
  /** where the panel's box stands: the cover grows out of it and shrinks back into it */
  const panel = useRef<HTMLDivElement | null>(null);
  const coverEl = useRef<HTMLDivElement | null>(null);
  const [from, setFrom] = useState({ left: 0, top: 0, width: 0 });
  /** what had the focus before the cover took it, to be given it back */
  const focusBefore = useRef<HTMLElement | null>(null);
  /** the close's own timer and frame, cleared if the panel goes before they fire */
  const closeTimer = useRef<{ id: number; raf: number } | null>(null);
  /** the mark whose stretch is lit: the one tapped, or the one the caret is in */
  const [lit, setLit] = useState(-1);
  const [jump, setJump] = useState(0);
  const area = useRef<HTMLTextAreaElement | null>(null);
  const wideArea = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(id);
  }, [copied]);
  const open = () => {
    const r = panel.current?.getBoundingClientRect();
    if (r) setFrom({ left: r.left, top: r.top, width: r.width });
    focusBefore.current = document.activeElement as HTMLElement | null;
    setGrown(false);
    setNarrow(false);
    setCover("on");
  };
  /* once it is up and laid out at the panel's size, the cover is told to grow: the layout is
   * read first so the browser has the starting state, and the growth is a transition from it */
  useEffect(() => {
    if (cover !== "on" || grown) return;
    const id = requestAnimationFrame(() => {
      void coverEl.current?.offsetWidth;
      setGrown(true);
      onCover?.(true);
      /* the text keeps the place the panel was reading, and takes the keyboard */
      if (wideArea.current) {
        wideArea.current.scrollTop = area.current?.scrollTop ?? 0;
        wideArea.current.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cover, grown]);
  /* the panel may go while the cover is up: the band it hid is let go, and nothing fires late */
  useEffect(
    () => () => {
      onCover?.(false);
      if (closeTimer.current) {
        window.clearTimeout(closeTimer.current.id);
        cancelAnimationFrame(closeTimer.current.raf);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  /* Closing: the panel's place is read again, in case it moved, and the text box inside the
   * cover is first set to the panel's own width, so that when the surface has shrunk back the
   * words under it are already wrapped the way the panel wraps them. The panel's text is then
   * scrolled to where the cover's is, so nothing jumps at the hand-over. */
  const close = () => {
    const r = panel.current?.getBoundingClientRect();
    if (r) setFrom({ left: r.left, top: r.top, width: r.width });
    setGrown(false);
    setCover((c) => (c === "on" ? "closing" : c));
    onCover?.(false);
    focusBefore.current?.focus({ preventScroll: true });
    focusBefore.current = null;
    const id = window.setTimeout(() => {
      setNarrow(true);
      const raf = requestAnimationFrame(() => {
        closeTimer.current = null;
        if (area.current && wideArea.current) area.current.scrollTop = wideArea.current.scrollTop;
      });
      closeTimer.current = { id, raf };
    }, RESET_FADE_MS);
    closeTimer.current = { id, raf: 0 };
  };
  useEffect(() => {
    if (cover !== "closing") return;
    const id = setTimeout(() => setCover("off"), COVER_MS);
    return () => clearTimeout(id);
  }, [cover]);
  /* the cover closes on Escape, the way every cover in the editor does */
  useEffect(() => {
    if (cover !== "on") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cover]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {}
  };
  const caret = (at: number) => setLit(markAt(starts, marks, at));
  const pick = (i: number) => {
    setLit(i);
    setJump((n) => n + 1);
  };
  const platform = (
    <Segmented<Platform>
      options={[
        { key: "android", icon: "android", label: "Android", title: t("targetAndroid", lang) },
        { key: "web", icon: "language", label: "Web", title: t("targetWeb", lang) },
      ]}
      value={doc.platform ?? defaultPlatformOf(doc.frames, doc.frame)}
      onChange={(platform) => onDoc({ platform })}
      p={p}
      height={40}
    />
  );

  return (
    <>
      {/* the target stands above the box, which starts under the panel's fade band */}
      <div ref={panel} style={{ display: "flex", flexDirection: "column", height: "100%", padding: `${PANEL_PAD_TOP}px 12px 12px`, gap: 10 }}>
        {platform}
        <PromptBox
          text={text}
          starts={starts}
          marks={marks}
          lit={-1}
          jump={0}
          onText={() => {}}
          onCaret={() => {}}
          p={p}
          areaRef={area}
          readOnly
          corner={
            <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
              <div className="m3-run" style={{ display: "flex", gap: 3 }}>
                <CopyButton copied={copied} onClick={copy} p={p} />
                <IconBtn icon="open_in_full" p={p} size={44} on onClick={open} title={t("fullscreen", lang)} />
              </div>
            </div>
          }
        />
      </div>
      {cover !== "off" && (
        <div
          ref={coverEl}
          role="dialog"
          aria-modal="true"
          aria-label={t("prompt", lang)}
          style={{
            position: "fixed",
            zIndex: 400,
            /* the full height from the first frame, as wide as the panel at first, then the whole
               window: the surface slides open from the right edge rather than growing from a corner */
            left: grown ? 0 : from.left,
            /* it starts just under the panel's band, so the band can fade rather than be covered, and rises over it as it opens */
            top: grown ? 0 : from.top,
            width: grown ? "100%" : from.width,
            bottom: 0,
            borderRadius: grown ? 0 : "18px 0 0 18px",
            background: p.surface,
            overflow: "hidden",
            transition: `left ${COVER_MS}ms ${COVER_EASE}, top ${COVER_MS}ms ${COVER_EASE}, width ${COVER_MS}ms ${COVER_EASE}, border-radius ${COVER_MS}ms ${COVER_EASE}`,
          }}
        >
          {/* Everything inside is laid out at its final size from the first frame, so no words
              reflow. The left columns hang off the surface's left edge and travel with it, so the
              target and the fields slide in from where they stood in the panel; the text box hangs
              off the right edge, where the panel's box already is, and only grows taller and
              wider under the surface. Its buttons sit in the same corner throughout. */}
          {/* the target travels between its two places -- the panel's top and the column's -- and
              never fades: it is the one thing on both sides of the change */}
          <div
            style={{
              position: "absolute",
              left: grown ? 20 : 12,
              width: grown ? 300 : from.width - 24,
              top: grown ? 40 : PANEL_PAD_TOP,
              transition: `left ${COVER_MS}ms ${COVER_EASE}, top ${COVER_MS}ms ${COVER_EASE}, width ${COVER_MS}ms ${COVER_EASE}`,
            }}
          >
            {platform}
          </div>
          <div
            className="no-scrollbar"
            style={{
              position: "absolute",
              left: 20,
              width: 300,
              top: grown ? 40 + 40 + 10 : PANEL_PAD_TOP + 40 + 10,
              bottom: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              overflowY: "auto",
              /* the rest fades in as the surface opens and fades out as it closes, so nothing
                 shows through the narrowing surface but the text box it came from */
              opacity: grown ? 1 : 0,
              transition: `top ${COVER_MS}ms ${COVER_EASE}, opacity ${grown ? COVER_MS : 140}ms ease`,
            }}
          >
            <Field value={doc.title} onChange={(title) => onDoc({ title })} placeholder={t("appName", lang)} p={p} icon="smartphone" />
            <FadeArea value={doc.brief} onChange={(brief) => onDoc({ brief })} placeholder={t("brief", lang)} p={p} />
          </div>
          <div
            className="no-scrollbar"
            style={{
              position: "absolute",
              left: 340,
              width: 220,
              top: grown ? 40 : PANEL_PAD_TOP,
              bottom: 12,
              display: "flex",
              flexDirection: "column",
              opacity: grown ? 1 : 0,
              transition: `top ${COVER_MS}ms ${COVER_EASE}, opacity ${grown ? COVER_MS : 140}ms ease`,
            }}
          >
            <Outline marks={marks} current={lit} onPick={pick} p={p} />
          </div>
          <div
            style={{
              position: "absolute",
              right: 12,
              /* on the way out the box takes the panel's width at once, so its words wrap as the panel's do */
              /* the box takes what the two columns leave, and keeps a readable width on a narrow window */
              width: narrow ? from.width - 24 : "max(280px, calc(100% - 592px))",
              top: grown ? 40 : PANEL_PAD_TOP + 40 + 10,
              bottom: 12,
              display: "flex",
              flexDirection: "column",
              transition: `top ${COVER_MS}ms ${COVER_EASE}`,
            }}
          >
            <PromptBox
              text={text}
              starts={starts}
              marks={marks}
              lit={lit}
              jump={jump}
              onText={(v) => onDoc({ promptEdit: v })}
              onCaret={caret}
              p={p}
              areaRef={wideArea}
              corner={
                <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                  {/* what was typed can be given up at the far end, away from the copy: it is a reset, not an undo */}
                  {/* the reset fades in with the cover and fades out first on the way out, before the box narrows */}
                  {edited && (
                    <span style={{ display: "inline-flex", opacity: grown ? 1 : 0, transition: `opacity ${grown ? COVER_MS : RESET_FADE_MS}ms ease` }}>
                      <IconBtn icon="restart_alt" p={p} size={44} on onClick={() => onDoc({ promptEdit: undefined })} title={t("promptReset", lang)} />
                    </span>
                  )}
                  <span style={{ flex: 1 }} />
                  {/* the copy and the way back to the panel, joined: both are about being done here. On
                      the way out the button already wears the panel's icon, so the hand-over is seamless. */}
                  <div className="m3-run" style={{ display: "flex", gap: 3 }}>
                    <CopyButton copied={copied} onClick={copy} p={p} />
                    <IconBtn icon={cover === "closing" ? "open_in_full" : "close_fullscreen"} p={p} size={44} on onClick={close} title={t(cover === "closing" ? "fullscreen" : "exitFullscreen", lang)} />
                  </div>
                </div>
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
