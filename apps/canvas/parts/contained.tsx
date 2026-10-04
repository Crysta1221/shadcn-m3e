"use client";

import { useState, type ReactNode } from "react";
import { PortalContainer } from "@/components/m3e/portal-container";

type Place = "start" | "end" | "center";
const FLEX: Record<Place, string> = { start: "flex-start", end: "flex-end", center: "center" };

/** A box the overlays inside it are drawn in, instead of on the page: a dialog or a menu shown
 *  open where it would appear. The transform makes `fixed` overlays lay out inside the box; what
 *  does not float (the trigger a menu hangs off) is placed in it by `ax` and `ay`. */
export function Contained({ width, height, ax = "start", ay = "start", children }: { width?: number; height?: number; ax?: Place; ay?: Place; children?: ReactNode }) {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setBox} data-contained style={{ position: "relative", transform: "translateZ(0)", overflow: "hidden", width, height, display: "flex", justifyContent: FLEX[ax], alignItems: FLEX[ay] }}>
      <PortalContainer container={box}>{children}</PortalContainer>
    </div>
  );
}
