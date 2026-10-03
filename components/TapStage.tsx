"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Action, BACK_TARGET, Frame, LINK_TARGET, Palette, Transition, frameSizeOf, linkHostOf, linkUrlOf } from "@/lib/tokens";
import { Icon } from "./M3Node";
import { TransitionPicker } from "./Inspector";
import { Field } from "./ui";
import { t, useLang } from "@/lib/i18n";

const STAGE_H = 190;
const STAGE_PAD = 12;
/** room the screen name above a mini frame takes */
const LABEL_H = 18;
const ARROW_W = 28;
const GAP = 12;

/** where the box inside the arriving screen starts; it always ends in place */
function entryOf(tr: Transition, w: number, h: number): { x?: number; y?: number; opacity?: number; scale?: number } {
  switch (tr) {
    case "slide":
      return { x: w, opacity: 0 };
    case "slideLeft":
      return { x: -w, opacity: 0 };
    case "slideUp":
      return { y: h * 0.7, opacity: 0 };
    case "slideDown":
      return { y: -h * 0.7, opacity: 0 };
    case "fade":
      return { opacity: 0 };
    case "expand":
      return { scale: 0.5, opacity: 0 };
    case "none":
      return {};
  }
}

const LOOP = { duration: 0.6, ease: [0.2, 0, 0, 1] as const, repeat: Infinity, repeatDelay: 1.2 };
/** someone who asked for less motion sees the box land once, and then stay */
const ONCE = { duration: 0 };

type Rect = { w: number; h: number };

/** how wide the stage is on screen, so both screens can be scaled down together to fit it */
function useAvailWidth(): [React.RefObject<HTMLDivElement | null>, number] {
  const stage = useRef<HTMLDivElement | null>(null);
  const [avail, setAvail] = useState(0);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setAvail(el.clientWidth));
    ro.observe(el);
    setAvail(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [stage, avail];
}

/** the arrow between the screen a tap leaves and what it opens; decoration, so it says nothing */
function StageArrow({ p, flip }: { p: Palette; flip?: boolean }) {
  return (
    <svg aria-hidden width={ARROW_W} height={16} viewBox="0 0 28 16" style={{ flex: "0 0 auto", transform: flip ? "scaleX(-1)" : undefined, marginTop: LABEL_H }}>
      <path d="M2 8 H22 M16 2 L23 8 L16 14" fill="none" stroke={p.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** a screen drawn small: a rounded outline with the screen name above it. The box inside stands
 *  for what the screen shows, and it is the box that moves when a transition plays. */
function MiniFrame({
  name,
  p,
  on,
  dot,
  rect,
  dashed,
  box,
}: {
  name: string;
  p: Palette;
  on: boolean;
  dot?: { x: number; y: number } | null;
  rect: Rect;
  dashed?: boolean;
  box?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: "0 0 auto" }}>
      <span
        style={{
          height: LABEL_H - 4,
          fontSize: 11,
          fontWeight: 600,
          color: on ? p.primary : p.onSurfaceVariant,
          maxWidth: rect.w + 24,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
      <div
        style={{
          position: "relative",
          width: rect.w,
          height: rect.h,
          borderRadius: 8,
          overflow: "hidden",
          background: on ? p.primaryContainer : p.surface,
          border: `${on ? 2 : 1}px ${dashed ? "dashed" : "solid"} ${on ? p.primary : p.outline}`,
          boxSizing: "border-box",
        }}
      >
        {box}
        {dot && (
          <span
            aria-hidden
            style={{ position: "absolute", left: dot.x - 5, top: dot.y - 5, width: 10, height: 10, borderRadius: 5, background: p.primary, border: `2px solid ${p.surface}` }}
          />
        )}
      </div>
    </div>
  );
}

/** the moving box inside a mini frame: a sheet of content, inset so the frame stays visible around it */
function ContentBox({ rect, p, on, children }: { rect: Rect; p: Palette; on: boolean; children?: React.ReactNode }) {
  const inset = Math.max(4, Math.round(rect.w * 0.1));
  return (
    <div
      style={{
        position: "absolute",
        left: inset,
        right: inset,
        top: inset,
        bottom: inset,
        borderRadius: 6,
        background: on ? p.primary : p.outlineVariant,
        color: on ? p.onPrimary : p.onSurfaceVariant,
        display: "grid",
        placeItems: "center",
      }}
    >
      {children}
    </div>
  );
}

/** What a tap does, drawn small: the screen the button sits on, an arrow, and the screen it opens.
 *  The transition plays over and over inside the arriving screen. */
export function TapStage({
  frames,
  self,
  selfRect,
  action,
  onChange,
  p,
}: {
  frames: Frame[];
  self: Frame | null;
  selfRect: { x: number; y: number; w: number; h: number } | null;
  action: Action | undefined;
  onChange: (a: Action) => void;
  p: Palette;
}) {
  const lang = useLang();
  const reduced = useReducedMotion();
  const loop = reduced ? ONCE : LOOP;
  const to = action?.to ?? null;
  const target = to && to !== BACK_TARGET ? (frames.find((f) => f.id === to) ?? null) : null;
  const back = to === BACK_TARGET;

  /* the stage scales both screens down together, so a desktop screen next to a phone one still fits */
  const [stage, avail] = useAvailWidth();

  const selfSize = self ? frameSizeOf(self) : { w: 412, h: 892 };
  const otherSize = target ? frameSizeOf(target) : back ? selfSize : null;
  /* with no other screen to go to, the stage carries a line of help under the frame */
  const hint = !target && !back && frames.filter((f) => f.id !== self?.id).length === 0;
  const maxH = STAGE_H - STAGE_PAD * 2 - LABEL_H - (hint ? 34 : 0);
  const wBudget = Math.max(80, (avail || 260) - STAGE_PAD * 2 - (otherSize ? ARROW_W + GAP * 2 : 0));
  const dpW = Math.max(1, selfSize.w + (otherSize?.w ?? 0));
  const dpH = Math.max(1, selfSize.h, otherSize?.h ?? 0);
  const k = Math.min(maxH / dpH, wBudget / dpW);
  const rectOf = (s: { w: number; h: number }): Rect => ({ w: Math.round(s.w * k), h: Math.round(s.h * k) });
  const fromRect = rectOf(selfSize);
  const toRect = rectOf(otherSize ?? selfSize);
  const dot = selfRect && self ? { x: (selfRect.x + selfRect.w / 2 - self.x) * k, y: (selfRect.y + selfRect.h / 2 - self.y) * k } : null;

  const screen = t("screen", lang);
  const arrow = (flip: boolean) => <StageArrow key="arrow" p={p} flip={flip} />;

  /* the screen the button sits on; going back, its box is the one that leaves */
  const fromFrame = (
    <MiniFrame
      key="from"
      name={self ? self.name || screen : ""}
      p={p}
      on={false}
      dot={dot}
      rect={fromRect}
      box={
        back ? (
          <motion.div
            key={`out-${action?.transition}`}
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: fromRect.w, opacity: 0 }}
            transition={loop}
            style={{ position: "absolute", inset: 0 }}
          >
            <ContentBox rect={fromRect} p={p} on={false} />
          </motion.div>
        ) : (
          <ContentBox rect={fromRect} p={p} on={false} />
        )
      }
    />
  );

  /* the screen the tap opens; its box is the one that arrives */
  const toFrame = (target || back) && (
    <MiniFrame
      key="to"
      name={target ? target.name || screen : t("back", lang)}
      p={p}
      on
      rect={toRect}
      dashed={back}
      box={
        <motion.div
          key={`in-${action?.transition}-${to}`}
          initial={back ? { x: -toRect.w, opacity: 0 } : entryOf(action?.transition ?? "slide", toRect.w, toRect.h)}
          animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          transition={loop}
          style={{ position: "absolute", inset: 0 }}
        >
          <ContentBox rect={toRect} p={p} on>
            {back && <Icon name="arrow_back" size={Math.max(14, Math.round(toRect.w * 0.3))} />}
          </ContentBox>
        </motion.div>
      }
    />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        ref={stage}
        style={{
          position: "relative",
          height: STAGE_H,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: p.surfaceContainerLow,
          backgroundImage: `radial-gradient(${p.outlineVariant} 1px, transparent 1px)`,
          backgroundSize: "12px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: GAP,
          padding: STAGE_PAD,
          boxSizing: "border-box",
        }}
      >
        {/* going back, the screen that comes into view stands to the left of the one being left */}
        {back ? [toFrame, arrow(true), fromFrame] : [fromFrame, toFrame && arrow(false), toFrame]}
        {hint && (
          <div style={{ position: "absolute", left: 12, right: 12, bottom: 10, fontSize: 12, lineHeight: 1.5, color: p.onSurfaceVariant, textAlign: "center" }}>{t("addFrameHint", lang)}</div>
        )}
      </div>
      {target && action && <TransitionPicker value={action.transition} onChange={(transition) => onChange({ ...action, transition })} p={p} />}
    </div>
  );
}

/** the window the link opens in, drawn as small as a screen beside it: a title bar with its
 *  three dots and an address pill, and the host written across the page below */
function MiniBrowser({ host, rect, p }: { host: string | null; rect: Rect; p: Palette }) {
  const lang = useLang();
  const bar = Math.max(12, Math.round(rect.h * 0.26));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: "0 0 auto" }}>
      <span style={{ height: LABEL_H - 4, fontSize: 11, fontWeight: 600, color: p.primary, maxWidth: rect.w + 24, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {t("linkBrowser", lang)}
      </span>
      <div
        style={{
          width: rect.w,
          height: rect.h,
          borderRadius: 8,
          overflow: "hidden",
          background: p.surface,
          border: `2px ${host ? "solid" : "dashed"} ${p.primary}`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: bar, flex: "0 0 auto", background: p.primaryContainer, display: "flex", alignItems: "center", gap: 3, padding: "0 4px" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} aria-hidden style={{ width: 3, height: 3, borderRadius: 2, background: p.onPrimaryContainer, opacity: 0.6, flex: "0 0 auto" }} />
          ))}
          <span style={{ flex: 1, minWidth: 0, height: Math.max(4, bar - 8), borderRadius: 3, background: p.surface }} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "grid", placeItems: "center", padding: "0 6px", gap: 2 }}>
          <Icon name="language" size={Math.max(14, Math.round(rect.w * 0.16))} />
          {/* with no address yet the page shows the scheme one starts with: a fragment of a URL, the same in every language */}
          <span style={{ fontSize: 9, fontWeight: 600, color: p.onSurfaceVariant, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{host ?? "https://"}</span>
        </div>
      </div>
    </div>
  );
}

/** What a tap opens on the web: the screen the button sits on, an arrow, and a browser window
 *  carrying the address. The field that sets the address sits right under the same stage. */
export function LinkStage({
  self,
  selfRect,
  action,
  onChange,
  p,
}: {
  self: Frame | null;
  selfRect: { x: number; y: number; w: number; h: number } | null;
  action: Action | undefined;
  onChange: (a: Action) => void;
  p: Palette;
}) {
  const lang = useLang();
  const [stage, avail] = useAvailWidth();

  const typed = action?.url ?? "";
  const host = linkHostOf(action);
  const bad = typed.trim().length > 0 && !linkUrlOf(action);

  const selfSize = self ? frameSizeOf(self) : { w: 412, h: 892 };
  /* the window is a landscape sheet beside the screen, sized in the same dp the stage scales */
  const winSize = { w: Math.round(selfSize.w * 1.4), h: Math.round(selfSize.w * 0.95) };
  const maxH = STAGE_H - STAGE_PAD * 2 - LABEL_H;
  const wBudget = Math.max(80, (avail || 260) - STAGE_PAD * 2 - ARROW_W - GAP * 2);
  const k = Math.min(maxH / Math.max(1, selfSize.h, winSize.h), wBudget / Math.max(1, selfSize.w + winSize.w));
  const rectOf = (s: { w: number; h: number }): Rect => ({ w: Math.round(s.w * k), h: Math.round(s.h * k) });
  const fromRect = rectOf(selfSize);
  const dot = selfRect && self ? { x: (selfRect.x + selfRect.w / 2 - self.x) * k, y: (selfRect.y + selfRect.h / 2 - self.y) * k } : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        ref={stage}
        style={{
          position: "relative",
          height: STAGE_H,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: p.surfaceContainerLow,
          backgroundImage: `radial-gradient(${p.outlineVariant} 1px, transparent 1px)`,
          backgroundSize: "12px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: GAP,
          padding: STAGE_PAD,
          boxSizing: "border-box",
        }}
      >
        <MiniFrame name={self ? self.name || t("screen", lang) : ""} p={p} on={false} dot={dot} rect={fromRect} box={<ContentBox rect={fromRect} p={p} on={false} />} />
        <StageArrow p={p} />
        <MiniBrowser host={host} rect={rectOf(winSize)} p={p} />
      </div>
      <Field
        value={typed}
        onChange={(url) => onChange({ to: LINK_TARGET, transition: action?.transition ?? "none", url })}
        placeholder="https://example.com"
        icon="link"
        p={p}
        invalid={bad}
        describedBy={bad ? "link-invalid" : undefined}
      />
      {bad && (
        <div id="link-invalid" role="alert" style={{ fontSize: 12, lineHeight: 1.5, color: p.error, padding: "0 4px" }}>
          {t("linkInvalid", lang)}
        </div>
      )}
    </div>
  );
}
