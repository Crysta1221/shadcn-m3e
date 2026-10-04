"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { PortalContainer } from "@/components/m3e/portal-container";

type Place = "start" | "end" | "center";
const FLEX: Record<Place, string> = { start: "flex-start", end: "flex-end", center: "center" };

/** the floating thing an open part draws inside its box: its content or popup element */
const OVERLAY = '[data-slot$="-popup"], [data-slot$="-content"]';
/** finds the overlay of a `fit` box under a measured element (the editor's measure pass) */
export const FIT_OVERLAY = `[data-fit] :is([data-slot$="-popup"], [data-slot$="-content"])`;

/** A box the overlays inside it are drawn in, instead of on the page: a dialog or a menu shown
 *  open where it would appear. The transform makes `fixed` overlays lay out inside the box; what
 *  does not float (the trigger a menu hangs off) is placed in it by `ax` and `ay`.
 *
 *  With `fit` the box is only a virtual viewport the overlay floats in, and the part is where the
 *  overlay is: the overlay's rect inside the box is measured and the box is moved so that rect
 *  lands on the part's own frame. The part's size then comes from the same overlay measured in
 *  the editor's pass (`FIT_OVERLAY`), so the outline, the selection and the drags are all about
 *  the dialog itself, not about a box it happens to float in. The scrim that would show around
 *  the shifted box is hidden (globals.css `[data-fit] [data-slot$="-overlay"]`). */
export function Contained({ width, height, ax = "start", ay = "start", fit = false, live = false, children }: { width?: number; height?: number; ax?: Place; ay?: Place; fit?: boolean; /** the preview's box: the overlay is opened by its trigger, so it must not be clipped */ live?: boolean; children?: ReactNode }) {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [shift, setShift] = useState<{ x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    if (!fit || !box) return;
    /* the overlay settles through its opening spring; measure every frame until it holds still
     * (a re-render restarts the watch, so a prop change re-fits) */
    let raf = 0;
    let last = "";
    let still = 0;
    const started = performance.now();
    const tick = () => {
      const overlay = box.querySelector<HTMLElement>(OVERLAY);
      const b = box.getBoundingClientRect();
      const r = overlay?.getBoundingClientRect();
      /* the canvas may be zoomed: rects are in screen pixels, the shift is applied in the
       * box's own (unscaled) units */
      const z = box.offsetWidth ? b.width / box.offsetWidth : 1;
      const x = Math.round(((r?.left ?? 0) - b.left) / z);
      const y = Math.round(((r?.top ?? 0) - b.top) / z);
      const now = `${x},${y}`;
      still = now === last ? still + 1 : 0;
      last = now;
      setShift({ x, y });
      if (still < 4 && performance.now() - started < 2500) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });
  const moved = fit && shift && (shift.x !== 0 || shift.y !== 0);
  return (
    <div
      ref={setBox}
      data-contained
      data-fit={fit || undefined}
      style={{
        position: "relative",
        transform: "translateZ(0)",
        /* the box may hang past the part's frame where the viewport it pretends to be is
         * larger than the overlay; nothing paints there but the (hidden) scrim. In the live
         * preview the overlay opens and closes on its own and must not be clipped either */
        overflow: fit || live ? "visible" : "hidden",
        left: moved ? -shift!.x : undefined,
        top: moved ? -shift!.y : undefined,
        width,
        height,
        display: "flex",
        justifyContent: FLEX[ax],
        alignItems: FLEX[ay],
      }}
    >
      <PortalContainer container={box}>{children}</PortalContainer>
    </div>
  );
}
