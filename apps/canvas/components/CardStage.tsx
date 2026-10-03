"use client";

import { useEffect, useRef, useState } from "react";
import { CARD_IMAGE_MIN, CARD_MEDIA_GAP, CARD_PADDING, CardAlign, CardImagePos, Item, Palette, cardContentAlignOf, cardImageMaxOf, cardImagePosOf, cardImageSizeOf, cardTextAlignOf, sizeOf } from "@/lib/tokens";
import { t, useLang } from "@/lib/i18n";
import { Icon } from "./M3Node";

/* A card drawn small on a stage of its own, the way the trigger tab draws a screen, with the
 * things on it where they are on the card: the picture and the words. The picture is dragged to
 * the edge it should sit on, or into the middle to lie behind the words; its inner edge is pulled
 * to make it bigger or smaller; the words are dragged to any of nine places. Nothing on the stage
 * is named, because the drawing is the card -- but everything that can be moved says so under
 * the pointer: it lights up, wears a ring, and while it is held the places it can go are drawn. */

/** the tallest the drawing is; the widest is the stage it stands on */
const CARD_MAX_H = 120;
const CARD_MIN = 56;
/** the grip on the picture's inner edge */
const GRIP = 18;
const GRIP_THICK = 5;
/** the two lines the words are drawn as */
const LINES_H = 16;

/** how wide the stage is, so the drawing can be scaled to it */
function useWidth(): [React.RefObject<HTMLDivElement | null>, number] {
  const el = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const ro = new ResizeObserver(() => setW(node.clientWidth));
    ro.observe(node);
    setW(node.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [el, w];
}

/** where a point inside the card asks the picture to go: the middle means behind the words,
 *  anywhere else the nearest edge */
function posAt(x: number, y: number, w: number, h: number): CardImagePos {
  const nx = x / w;
  const ny = y / h;
  if (nx > 0.3 && nx < 0.7 && ny > 0.3 && ny < 0.7) return "background";
  /* the nearest edge, each measured as a share of its own side so a wide card is not all top and bottom */
  const d = { top: ny, bottom: 1 - ny, leading: nx, trailing: 1 - nx };
  return (Object.keys(d) as (keyof typeof d)[]).reduce((a, b) => (d[b] < d[a] ? b : a));
}

/** a share of a side, read as one of its three places */
const third = (n: number): CardAlign => (n < 1 / 3 ? "start" : n > 2 / 3 ? "end" : "center");

/** a drag that follows the pointer until it is let go */
function follow(e: React.PointerEvent, onMove: (ev: PointerEvent) => void, onEnd: () => void) {
  e.preventDefault();
  e.stopPropagation();
  const up = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", up);
    onEnd();
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
}

type Piece = "picture" | "grip" | "words" | null;

export function CardStage({ item, onChange, p }: { item: Item; onChange: (patch: Partial<Item>) => void; p: Palette }) {
  const lang = useLang();
  const [stage, avail] = useWidth();
  const card = useRef<HTMLDivElement | null>(null);
  /** what the pointer is over, and what it is holding */
  const [hot, setHot] = useState<Piece>(null);
  const [held, setHeld] = useState<Piece>(null);
  /* a drag outlives the render it began in: the handlers read the item as it is now */
  const live = useRef(item);
  live.current = item;
  const { w: dpW, h: dpH } = sizeOf(item, {});
  const maxW = Math.max(CARD_MIN, (avail || 220) - 16);
  const k = Math.min(maxW / Math.max(1, dpW), CARD_MAX_H / Math.max(1, dpH));
  const w = Math.max(CARD_MIN, Math.round(dpW * k));
  const h = Math.max(CARD_MIN, Math.round(dpH * k));
  const scale = w / Math.max(1, dpW);
  const px = (dp: number) => Math.max(1, Math.round(dp * scale));

  const hasImage = !item.noImage;
  const pos = cardImagePosOf(item);
  const align = cardContentAlignOf(item);
  const across = cardTextAlignOf(item);
  const pad = px(CARD_PADDING);
  const gap = px(CARD_MEDIA_GAP);
  const size = px(cardImageSizeOf(item));
  const radius = px(item.corners?.tl ?? item.radiusTop ?? 12);

  /* the picture's box inside the drawing, and the box the words have left */
  const inner = { x: pad, y: pad, w: w - pad * 2, h: h - pad * 2 };
  const picture: React.CSSProperties = !hasImage
    ? { display: "none" }
    : pos === "background"
      ? { left: 0, top: 0, width: w, height: h, borderRadius: radius }
      : pos === "top"
        ? { left: inner.x, top: inner.y, width: inner.w, height: size }
        : pos === "bottom"
          ? { left: inner.x, top: inner.y + inner.h - size, width: inner.w, height: size }
          : pos === "leading"
            ? { left: inner.x, top: inner.y, width: size, height: inner.h }
            : { left: inner.x + inner.w - size, top: inner.y, width: size, height: inner.h };
  /* the box the words have left; a picture too big for the card leaves them a sliver at least */
  const wordsOf = (it: Item) => {
    const p2 = cardImagePosOf(it);
    const s2 = px(cardImageSizeOf(it));
    const raw =
      it.noImage || p2 === "background"
        ? inner
        : p2 === "top"
          ? { x: inner.x, y: inner.y + s2 + gap, w: inner.w, h: inner.h - s2 - gap }
          : p2 === "bottom"
            ? { x: inner.x, y: inner.y, w: inner.w, h: inner.h - s2 - gap }
            : p2 === "leading"
              ? { x: inner.x + s2 + gap, y: inner.y, w: inner.w - s2 - gap, h: inner.h }
              : { x: inner.x, y: inner.y, w: inner.w - s2 - gap, h: inner.h };
    const wMin = 24;
    const hMin = LINES_H;
    return {
      x: Math.min(raw.x, inner.x + inner.w - wMin),
      y: Math.min(raw.y, inner.y + inner.h - hMin),
      w: Math.max(wMin, raw.w),
      h: Math.max(hMin, raw.h),
    };
  };
  const words = wordsOf(item);

  /* ---- the picture is dragged to where it should sit ---- */
  const movePicture = (e: React.PointerEvent) => {
    setHeld("picture");
    follow(
      e,
      (ev) => {
        const box = card.current?.getBoundingClientRect();
        if (!box) return;
        const next = posAt(ev.clientX - box.left, ev.clientY - box.top, box.width, box.height);
        if (next !== cardImagePosOf(live.current)) onChange({ imagePos: next === "top" ? undefined : next });
      },
      () => setHeld(null),
    );
  };
  /* ---- its inner edge is pulled to size it ---- */
  const sizePicture = (e: React.PointerEvent) => {
    setHeld("grip");
    follow(
      e,
      (ev) => {
        const box = card.current?.getBoundingClientRect();
        if (!box) return;
        const from =
          pos === "top" ? ev.clientY - box.top - pad : pos === "bottom" ? box.bottom - ev.clientY - pad : pos === "leading" ? ev.clientX - box.left - pad : box.right - ev.clientX - pad;
        const dp = Math.round(from / scale);
        onChange({ imageSize: Math.max(CARD_IMAGE_MIN, Math.min(cardImageMaxOf(live.current), dp)) });
      },
      () => setHeld(null),
    );
  };
  /* ---- the words are dragged to one of nine places ---- */
  const moveWords = (e: React.PointerEvent) => {
    setHeld("words");
    follow(
      e,
      (ev) => {
        const box = card.current?.getBoundingClientRect();
        if (!box) return;
        const it = live.current;
        const area = wordsOf(it);
        const nextY = third((ev.clientY - box.top - area.y) / Math.max(1, area.h));
        const nextX = third((ev.clientX - box.left - area.x) / Math.max(1, area.w));
        const patch: Partial<Item> = {};
        if (nextY !== cardContentAlignOf(it)) patch.contentAlign = nextY;
        if (nextX !== cardTextAlignOf(it)) patch.textAlign = nextX === "start" ? undefined : nextX;
        if (Object.keys(patch).length) onChange(patch);
      },
      () => setHeld(null),
    );
  };

  /* the keyboard moves the same things: arrows put the picture on an edge, enter lays it behind;
   * arrows walk the words across their nine places */
  const keyPicture = (e: React.KeyboardEvent) => {
    /* with shift, the arrows pull the picture's inner edge instead: 4dp a step, like the sliders */
    if (e.shiftKey && pos !== "background" && (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      const band = pos === "top" || pos === "bottom";
      const grow = band ? e.key === "ArrowDown" : e.key === "ArrowRight";
      const shrink = band ? e.key === "ArrowUp" : e.key === "ArrowLeft";
      if (!grow && !shrink) return;
      e.preventDefault();
      const d = (grow ? 4 : -4) * (pos === "bottom" || pos === "trailing" ? -1 : 1);
      onChange({ imageSize: Math.max(CARD_IMAGE_MIN, Math.min(cardImageMaxOf(item), cardImageSizeOf(item) + d)) });
      return;
    }
    const next: CardImagePos | undefined = e.key === "ArrowUp" ? "top" : e.key === "ArrowDown" ? "bottom" : e.key === "ArrowLeft" ? "leading" : e.key === "ArrowRight" ? "trailing" : e.key === "Enter" || e.key === " " ? "background" : undefined;
    if (!next) return;
    e.preventDefault();
    onChange({ imagePos: next === "top" ? undefined : next });
  };
  /* what a screen reader hears: the thing, and where it is on the card now */
  const placeText = { top: "imageTop", bottom: "imageBottom", leading: "imageLeading", trailing: "imageTrailing", background: "imageBehind" } as const;
  const pictureName = `${t("image", lang)}: ${t(placeText[pos], lang)}${pos === "background" ? "" : `, ${t("imageSize", lang)} ${cardImageSizeOf(item)}dp`}`;
  const rowText = { start: "textTop", center: "textMiddle", end: "textBottom" } as const;
  const colText = { start: "textStart", center: "textCenter", end: "textEnd" } as const;
  const wordsName = `${t("text", lang)}: ${t(rowText[align], lang)} / ${t(colText[across], lang)}`;
  const keyWords = (e: React.KeyboardEvent) => {
    const order: CardAlign[] = ["start", "center", "end"];
    const dy = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
    const dx = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
    if (!dy && !dx) return;
    e.preventDefault();
    if (dy) onChange({ contentAlign: order[Math.max(0, Math.min(2, order.indexOf(align) + dy))] });
    if (dx) {
      const next = order[Math.max(0, Math.min(2, order.indexOf(across) + dx))];
      onChange({ textAlign: next === "start" ? undefined : next });
    }
  };

  /* the grip sits on the picture's inner edge, across the middle of it */
  const grip: React.CSSProperties =
    pos === "top"
      ? { left: "50%", bottom: -GRIP_THICK / 2 - 1, width: GRIP, height: GRIP_THICK, transform: "translateX(-50%)", cursor: "ns-resize" }
      : pos === "bottom"
        ? { left: "50%", top: -GRIP_THICK / 2 - 1, width: GRIP, height: GRIP_THICK, transform: "translateX(-50%)", cursor: "ns-resize" }
        : pos === "leading"
          ? { top: "50%", right: -GRIP_THICK / 2 - 1, width: GRIP_THICK, height: GRIP, transform: "translateY(-50%)", cursor: "ew-resize" }
          : { top: "50%", left: -GRIP_THICK / 2 - 1, width: GRIP_THICK, height: GRIP, transform: "translateY(-50%)", cursor: "ew-resize" };

  /* where in their box the two lines stand */
  const lineTop = align === "start" ? 0 : align === "center" ? Math.max(0, (words.h - LINES_H) / 2) : Math.max(0, words.h - LINES_H);
  const lineSide = (share: number): React.CSSProperties => (across === "start" ? { left: 0 } : across === "center" ? { left: `${(1 - share) * 50}%` } : { right: 0 });

  const pictureHot = hot === "picture" || hot === "grip" || held === "picture";
  const wordsHot = hot === "words" || held === "words";
  /* while the picture is held, the five places it can go are drawn, the one under it lit */
  const zones: { key: CardImagePos; style: React.CSSProperties }[] = [
    { key: "top", style: { left: 0, top: 0, width: w, height: h * 0.3 } },
    { key: "bottom", style: { left: 0, top: h * 0.7, width: w, height: h * 0.3 } },
    { key: "leading", style: { left: 0, top: h * 0.3, width: w * 0.3, height: h * 0.4 } },
    { key: "trailing", style: { left: w * 0.7, top: h * 0.3, width: w * 0.3, height: h * 0.4 } },
    { key: "background", style: { left: w * 0.3, top: h * 0.3, width: w * 0.4, height: h * 0.4 } },
  ];
  const places: CardAlign[] = ["start", "center", "end"];
  const at = (v: CardAlign) => (v === "start" ? "10%" : v === "center" ? "50%" : "90%");

  return (
    <div ref={stage} role="group" aria-label={t("cardLayout", lang)} style={{ flex: 1, minWidth: 0, background: p.surfaceContainerLow, borderRadius: 12, padding: 8, display: "grid", placeItems: "center" }}>
      <div
        ref={card}
        style={{
          position: "relative",
          width: w,
          height: h,
          background: p.surfaceContainerHighest,
          border: `1.5px solid ${p.outline}`,
          boxSizing: "border-box",
          borderRadius: radius,
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {hasImage && (
          <div
            role="button"
            tabIndex={0}
            aria-label={pictureName}
            title={t("image", lang)}
            onPointerDown={movePicture}
            onPointerEnter={() => setHot("picture")}
            onPointerLeave={() => setHot(null)}
            onKeyDown={keyPicture}
            style={{
              position: "absolute",
              ...picture,
              borderRadius: pos === "background" ? radius : Math.min(6, radius),
              background: p.primaryContainer,
              opacity: pos === "background" ? 0.55 : 1,
              boxSizing: "border-box",
              /* the ring says it can be picked up; the pointer says whether it is */
              outline: `2px solid ${pictureHot ? p.primary : "transparent"}`,
              outlineOffset: -2,
              cursor: held === "picture" ? "grabbing" : "grab",
              touchAction: "none",
              display: "grid",
              placeItems: "center",
              color: p.onPrimaryContainer,
              transition: "outline-color 120ms",
            }}
          >
            {/* the picture's mark until it is hovered, then the mark of a thing that moves */}
            <Icon name={pictureHot ? "open_with" : "image"} size={Math.min(20, Math.max(12, Math.round(Math.min(Number(picture.width), Number(picture.height)) * 0.5)))} />
            {pos !== "background" && (
              <span
                aria-hidden
                onPointerDown={sizePicture}
                onPointerEnter={() => setHot("grip")}
                onPointerLeave={() => setHot("picture")}
                style={{
                  position: "absolute",
                  ...grip,
                  borderRadius: 3,
                  background: p.primary,
                  border: `1px solid ${p.surface}`,
                  boxSizing: "content-box",
                  touchAction: "none",
                  /* the grip grows a little under the pointer, so it reads as a handle and not a mark */
                  transform: `${grip.transform} scale(${hot === "grip" || held === "grip" ? 1.4 : 1})`,
                  transition: "transform 120ms",
                }}
              />
            )}
          </div>
        )}
        {/* the words' whole box, drawn while they are hovered or held; held, the nine places they can stand appear in it */}
        {wordsHot && words.w > 0 && words.h > 0 && (
          <span aria-hidden style={{ position: "absolute", left: words.x, top: words.y, width: words.w, height: words.h, borderRadius: 4, outline: `1.5px dashed ${p.primary}`, outlineOffset: 2, pointerEvents: "none" }}>
            {held === "words" &&
              places.flatMap((row) =>
                places.map((col) => {
                  const on = row === align && col === across;
                  return (
                    <span
                      key={`${row}${col}`}
                      style={{ position: "absolute", left: at(col), top: at(row), width: on ? 8 : 4, height: on ? 8 : 4, borderRadius: 4, background: p.primary, opacity: on ? 1 : 0.35, transform: "translate(-50%, -50%)", transition: "width 120ms, height 120ms" }}
                    />
                  );
                }),
              )}
          </span>
        )}
        <div
          role="button"
          tabIndex={0}
          aria-label={wordsName}
          title={t("text", lang)}
          onPointerDown={moveWords}
          onPointerEnter={() => setHot("words")}
          onPointerLeave={() => setHot(null)}
          onKeyDown={keyWords}
          /* only the lines themselves take the pointer, so a picture lying behind them can still be grabbed */
          style={{ position: "absolute", left: words.x, top: words.y + lineTop - 3, width: Math.max(0, words.w), height: LINES_H + 6, cursor: held === "words" ? "grabbing" : "grab", touchAction: "none", overflow: "hidden" }}
        >
          {/* the words as two lines: a headline and a shorter body line, standing where the words do */}
          <span aria-hidden style={{ position: "absolute", ...lineSide(0.62), top: 3, width: "62%", height: 6, borderRadius: 3, background: wordsHot ? p.primary : p.onSurface, opacity: 0.8, transition: "background 120ms" }} />
          <span aria-hidden style={{ position: "absolute", ...lineSide(0.4), top: 14, width: "40%", height: 5, borderRadius: 3, background: wordsHot ? p.primary : p.onSurfaceVariant, opacity: 0.6, transition: "background 120ms" }} />
        </div>
        {held === "picture" &&
          zones.map((z) => (
            <span
              key={z.key}
              aria-hidden
              style={{
                position: "absolute",
                ...z.style,
                boxSizing: "border-box",
                border: `1.5px dashed ${p.primary}`,
                borderRadius: 6,
                background: z.key === pos ? p.primary : "transparent",
                opacity: z.key === pos ? 0.3 : 0.5,
                pointerEvents: "none",
              }}
            />
          ))}
      </div>
    </div>
  );
}
