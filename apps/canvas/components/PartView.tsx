
import { useMemo } from "react";
import { Item } from "@/lib/tokens";
import { useLang } from "@/lib/i18n";
import { useIcons } from "@/parts/icons";
import { PartSurface } from "@/parts/theme";
import { appearanceOf } from "@/parts/appearance";
import { partBySlug, viewOf } from "@/parts/registry";
import type { Screen } from "@/parts/types";
import { renderNode } from "@/parts/render";
import type { PNode } from "@/parts/node";

const NOTHING: PNode = { type: "span" };

/** A part drawn as the real shadcn M3E component it stands for. On the canvas it is inert: a press
 *  belongs to the part (to select and drag it), not to the button inside it. In the preview
 *  (`live`) it works. */
export function PartView({ item, live = false, screen }: { item: Item; live?: boolean; /** the frame the part is on: an open overlay's box is no larger than it */ screen?: Screen }) {
  const def = partBySlug(item.component);
  /* a prop left at its default shows the default of the editor's language */
  const lang = useLang();
  const tree = useMemo(() => (def ? viewOf(def, item.props, appearanceOf(item), screen, live) : null), [def, item.props, item.fill, item.textColor, item.corners, screen?.w, screen?.h, live, lang]);
  /* the icon component is memoized: icons that arrive after the first draw show only in a fresh tree */
  const icons = useIcons(tree ?? NOTHING);
  if (!tree) return <span style={{ color: "#B3261E", fontSize: 12 }}>Unknown part {item.component}</span>;
  return (
    <PartSurface>
      {/* an inline box inside the part's block would sit on the strut's baseline, ~a line's
       *  leading low; top-aligned, the part's content starts at the part's own top */}
      <div key={icons} inert={!live} style={{ display: "inline-flex", verticalAlign: "top", pointerEvents: live ? undefined : "none" }}>
        {renderNode(tree)}
      </div>
    </PartSurface>
  );
}
