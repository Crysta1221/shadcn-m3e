
import { Item, Palette, sizeOf } from "@/lib/tokens";
import type { Screen } from "@/parts/types";
import { PartView } from "./PartView";

/** A part that is a real shadcn M3E component: the canvas gives it the box it measured, a ring
 *  when selected, and the pointer, and leaves everything else to the component. */
export function ComponentNode({
  item,
  palette,
  widths,
  pressed,
  dragging,
  selected,
  instant,
  interactive = true,
  onPointerDown,
  screen,
}: {
  item: Item;
  palette: Palette;
  widths: Record<string, number>;
  pressed?: boolean;
  dragging?: boolean;
  selected?: boolean;
  instant?: boolean;
  interactive?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  /** the frame the part is on: an open overlay's box is no larger than it */
  screen?: Screen;
}) {
  const size = sizeOf(item, widths);
  return (
    <div
      data-node={item.id}
      data-kind={item.kind}
      onPointerDown={onPointerDown}
      style={{
        width: size.w,
        height: size.h,
        boxSizing: "border-box",
        flex: "0 0 auto",
        cursor: !interactive ? "default" : dragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
        borderRadius: 14,
        transform: pressed ? "scale(0.97)" : undefined,
        outline: selected ? `2px solid ${palette.primary}` : "2px solid transparent",
        outlineOffset: 3,
        transition: instant ? "outline-color 120ms" : "outline-color 120ms, transform 160ms cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      <PartView item={item} screen={screen} />
    </div>
  );
}
