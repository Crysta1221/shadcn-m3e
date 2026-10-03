"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Palette } from "@/lib/tokens";
import { t, useLang } from "@/lib/i18n";

type IconMeta = { n: string; p: number; t: string };

const FONT = '24px "Material Symbols Rounded"';
/** module-level so validation survives re-mounts of the panel */
let cache: IconMeta[] | null = null;
/** what has been measured so far, by name; a panel reads it into state when it opens */
const glyphOk = new Map<string, boolean>();

/** Candidates measured per pass. A real Material Symbols glyph is exactly 1em
 *  wide; a name with no glyph falls back to text and measures wider. Icon names
 *  can be as short as "tv"/"4k", so we compare against a known-good reference
 *  glyph rather than a width threshold. */
const BATCH = 400;
const SHOWN = 240;

export function IconPicker({
  value,
  onChange,
  onClose,
  palette,
  extras = [],
}: {
  value: string | null;
  onChange: (icon: string | null) => void;
  onClose: () => void;
  palette: Palette;
  /** choices that are not icons but stand where one would -- a switch at the end of a list
   *  item -- drawn beside "no icon" in the same dashed frame */
  extras?: { icon: string; title: string }[];
}) {
  const lang = useLang();
  const [icons, setIcons] = useState<IconMeta[] | null>(cache);
  const [q, setQ] = useState("");
  const [fontReady, setFontReady] = useState(false);
  /* the measured names, as state, so what is shown follows each measuring pass */
  const [known, setKnown] = useState<ReadonlyMap<string, boolean>>(() => new Map(glyphOk));
  /* the icon the arrow keys have reached in the grid */
  const [cursor, setCursor] = useState(0);
  const grid = useRef<HTMLDivElement>(null);

  const refEl = useRef<HTMLSpanElement>(null);
  const probeEls = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Dismiss the picker without clearing the editor's selection.
      e.stopPropagation();
      onClose();
    };
    document.addEventListener("keydown", key, true);
    return () => document.removeEventListener("keydown", key, true);
  }, [onClose]);

  useEffect(() => {
    if (cache) return;
    /* a panel closed mid-flight asks for nothing more; a list that failed to arrive is not kept,
     * so the next opening asks again */
    const ctl = new AbortController();
    let alive = true;
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/material-symbols.json`, { signal: ctl.signal })
      .then((r) => r.json())
      .then((d: IconMeta[]) => {
        cache = d;
        if (alive) setIcons(d);
      })
      .catch(() => {
        if (alive) setIcons([]);
      });
    return () => {
      alive = false;
      ctl.abort();
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const done = () => alive && setFontReady(true);
    if (document.fonts.check(FONT)) {
      done();
      return;
    }
    document.fonts.load(FONT, "search").then(done, done);
    return () => {
      alive = false;
    };
  }, []);

  const candidates = useMemo(() => {
    if (!icons) return [];
    const s = q.trim().toLowerCase().replace(/\s+/g, "_");
    if (!s) return icons.slice(0, BATCH);
    const raw = q.trim().toLowerCase();
    const starts: IconMeta[] = [];
    const rest: IconMeta[] = [];
    for (const i of icons) {
      if (i.n.startsWith(s)) starts.push(i);
      else if (i.n.includes(s) || i.t.includes(raw)) rest.push(i);
      if (starts.length + rest.length >= BATCH * 2) break;
    }
    return [...starts, ...rest].slice(0, BATCH);
  }, [icons, q]);

  const unknown = useMemo(() => candidates.filter((c) => !known.has(c.n)), [candidates, known]);

  useLayoutEffect(() => {
    if (!fontReady || unknown.length === 0) return;
    const ref = refEl.current?.getBoundingClientRect().width ?? 0;
    if (ref <= 0) return;
    let learned = false;
    for (const c of unknown) {
      const el = probeEls.current.get(c.n);
      if (!el) continue;
      const w = el.getBoundingClientRect().width;
      glyphOk.set(c.n, Math.abs(w - ref) < 0.75);
      learned = true;
    }
    if (learned) setKnown(new Map(glyphOk));
  }, [fontReady, unknown]);

  const visible = useMemo(() => candidates.filter((c) => known.get(c.n) === true).slice(0, SHOWN), [candidates, known]);
  const at = Math.min(cursor, Math.max(0, visible.length - 1));
  /* the arrow keys walk the grid: a row at a time up and down, read off how many tiles share a line */
  const onGridKey = (e: React.KeyboardEvent) => {
    const tiles = Array.from(grid.current?.querySelectorAll<HTMLElement>("[data-icon]") ?? []);
    if (!tiles.length) return;
    const top = tiles[0].offsetTop;
    const cols = Math.max(1, tiles.findIndex((el) => el.offsetTop !== top)) || tiles.length;
    let next = -1;
    if (e.key === "ArrowRight") next = Math.min(at + 1, tiles.length - 1);
    else if (e.key === "ArrowLeft") next = Math.max(at - 1, 0);
    else if (e.key === "ArrowDown") next = Math.min(at + cols, tiles.length - 1);
    else if (e.key === "ArrowUp") next = Math.max(at - cols, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tiles.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setCursor(next);
    tiles[next].focus();
  };

  const loading = !icons || !fontReady;

  return (
    <div>
      {/* Hidden probes need intrinsic text widths to distinguish missing glyphs. */}
      <div
        aria-hidden
        style={{ position: "fixed", left: -99999, top: 0, visibility: "hidden", pointerEvents: "none" }}
      >
        <span ref={refEl} className="msr" style={{ fontSize: 24, width: "auto" }}>
          search
        </span>
        {unknown.map((c) => (
          <span
            key={c.n}
            ref={(el) => {
              if (el) probeEls.current.set(c.n, el);
              else probeEls.current.delete(c.n);
            }}
            className="msr"
            style={{ fontSize: 24, width: "auto" }}
          >
            {c.n}
          </span>
        ))}
      </div>

      {/* search line and grid share one surface: the line stays put while the icons scroll under it */}
      <div style={{ position: "relative" }}>
      <div
        className="no-scrollbar"
        style={{
          height: 292,
          overflowY: "auto",
          overflowX: "hidden",
          borderRadius: 16,
          background: palette.surfaceContainerLow,
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            height: 44,
            padding: "0 14px",
            background: palette.surfaceContainerLow,
          }}
        >
          {/* the icons pass under the search line and fade into it, rather than meeting a rule */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "100%",
              height: 20,
              background: `linear-gradient(to bottom, ${palette.surfaceContainerLow}, transparent)`,
              pointerEvents: "none",
            }}
          />
          <input
            aria-label={t("searchIcons", lang)}
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setCursor(0);
            }}
            placeholder={icons ? t("searchIcons", lang) : t("loading", lang)}
            style={{
              flex: 1,
              minWidth: 0,
              height: 40,
              border: "none",
              background: "transparent",
              color: palette.onSurface,
              fontSize: 14,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </div>
        <div
          ref={grid}
          onKeyDown={onGridKey}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(42px, 1fr))",
            gap: 4,
            padding: 6,
            alignContent: "start",
          }}
        >
          {!q && (
            /* the first tile stands for "no icon"; it sits where the eye lands first */
            <button
              title={t("noIcon", lang)}
              aria-label={t("noIcon", lang)}
              aria-pressed={value === null}
              onClick={() => onChange(null)}
              style={{
                aspectRatio: "1",
                minWidth: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: 12,
                border: `1.5px dashed ${value === null ? "transparent" : palette.outline}`,
                background: value === null ? palette.primary : "transparent",
                color: value === null ? palette.onPrimary : palette.onSurfaceVariant,
                cursor: "pointer",
              }}
            >
              {/* a crossed-out circle: the same drawn language the width presets use */}
              <svg width={22} height={22} viewBox="0 0 22 22" aria-hidden>
                <circle cx={11} cy={11} r={8} fill="none" stroke="currentColor" strokeWidth={1.6} />
                <line x1={5.3} y1={5.3} x2={16.7} y2={16.7} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
              </svg>
            </button>
          )}
          {!q &&
            extras.map((x) => (
              <button
                key={x.icon}
                title={x.title}
                aria-label={x.title}
                aria-pressed={value === x.icon}
                onClick={() => onChange(x.icon)}
                style={{
                  aspectRatio: "1",
                  minWidth: 0,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 12,
                  border: `1.5px dashed ${value === x.icon ? "transparent" : palette.outline}`,
                  background: value === x.icon ? palette.primary : "transparent",
                  color: value === x.icon ? palette.onPrimary : palette.onSurfaceVariant,
                  cursor: "pointer",
                }}
              >
                <span className="msr" style={{ fontSize: 22 }}>
                  {x.icon}
                </span>
              </button>
            ))}
          {visible.map((i, idx) => (
            <button
              key={i.n}
              data-icon={i.n}
              title={i.n}
              aria-label={i.n}
              aria-pressed={value === i.n}
              tabIndex={idx === at ? 0 : -1}
              onFocus={() => setCursor(idx)}
              onClick={() => onChange(i.n)}
              style={{
                aspectRatio: "1",
                minWidth: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: 12,
                border: "none",
                background: value === i.n ? palette.primary : "transparent",
                color: value === i.n ? palette.onPrimary : palette.onSurfaceVariant,
                cursor: "pointer",
              }}
            >
              <span className="msr" style={{ fontSize: 22 }}>
                {i.n}
              </span>
            </button>
          ))}
          {!loading && visible.length === 0 && (
            <div role="status" style={{ gridColumn: "1 / -1", padding: 16, fontSize: 13, color: palette.outline, display: "flex", alignItems: "center", gap: 8 }}>
              <span className="msr" aria-hidden style={{ fontSize: 24 }}>search_off</span>
              {t("noIcons", lang)}
            </div>
          )}
          {loading && (
            <div role="status" style={{ gridColumn: "1 / -1", padding: 16, fontSize: 13, color: palette.outline, display: "flex", alignItems: "center", gap: 8 }}>
              <span className="msr" aria-hidden style={{ fontSize: 24 }}>hourglass_top</span>
              {t("loading", lang)}
            </div>
          )}
        </div>
      </div>
      {/* and they fade out again at the foot of the box */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 28,
          borderRadius: "0 0 16px 16px",
          background: `linear-gradient(to top, ${palette.surfaceContainerLow}, transparent)`,
          pointerEvents: "none",
        }}
      />
      </div>
    </div>
  );
}
