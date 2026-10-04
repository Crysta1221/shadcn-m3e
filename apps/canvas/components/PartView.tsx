"use client";

import { useMemo } from "react";
import { Item } from "@/lib/tokens";
import { useIcons } from "@/parts/icons";
import { PartSurface } from "@/parts/theme";
import { partBySlug, viewOf } from "@/parts/registry";
import { renderNode } from "@/parts/render";
import type { PNode } from "@/parts/node";

const NOTHING: PNode = { type: "span" };

/** A part drawn as the real shadcn M3E component it stands for. On the canvas it is inert: a press
 *  belongs to the part (to select and drag it), not to the button inside it. In the preview
 *  (`live`) it works. */
export function PartView({ item, live = false }: { item: Item; live?: boolean }) {
  const def = partBySlug(item.component);
  const tree = useMemo(() => (def ? viewOf(def, item.props) : null), [def, item.props]);
  useIcons(tree ?? NOTHING);
  if (!tree) return <span style={{ color: "#B3261E", fontSize: 12 }}>Unknown part {item.component}</span>;
  return (
    <PartSurface>
      <div inert={!live} style={{ display: "inline-flex", pointerEvents: live ? undefined : "none" }}>
        {renderNode(tree)}
      </div>
    </PartSurface>
  );
}
