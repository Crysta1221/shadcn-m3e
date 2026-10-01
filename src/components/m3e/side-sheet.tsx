import * as React from "react"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { ScrollArea } from "@/components/m3e/scroll-area"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 standard side sheet: a panel beside the content that shares the window
 * with it, unlike the modal one (`Sheet`) that covers it with a scrim.
 *
 * Opening changes the width, so the content next to it reflows on the spatial
 * spring. The panel keeps its own width inside and is clipped while it grows,
 * and it is `inert` when closed, so nothing in it can take focus.
 *
 *   docked    flush with the window edge, a 1dp divider on the inner edge
 *   detached  floats 16dp from the edges, large corners on all sides
 * Width is 256–400dp; 360dp by default.
 */
type SideSheetProps = Omit<React.ComponentProps<"aside">, "title"> & {
  open?: boolean
  side?: "left" | "right"
  /** floats with a margin and rounded corners instead of sitting on the edge */
  detached?: boolean
  /** in px, 256–400 */
  width?: number
}

function SideSheet({
  open = true,
  side = "right",
  detached = false,
  width = 360,
  className,
  style,
  children,
  ...props
}: SideSheetProps) {
  const w = Math.min(400, Math.max(256, width))

  return (
    <aside
      data-slot="side-sheet"
      data-open={open || undefined}
      data-side={side}
      data-detached={detached || undefined}
      aria-hidden={!open || undefined}
      inert={!open}
      style={{ "--side-sheet-w": `${w}px`, ...style }}
      className={cn(
        "h-full shrink-0 overflow-hidden transition-[width] motion-spatial-default",
        open
          ? detached
            ? "w-[calc(var(--side-sheet-w)+1rem)]"
            : "w-(--side-sheet-w)"
          : "w-0",
        side === "left" && "order-first",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex h-full w-(--side-sheet-w) flex-col text-on-surface",
          detached
            ? cn(
                "my-0 h-[calc(100%-2rem)] rounded-lg bg-surface-container-low",
                "mt-4",
                side === "right" ? "mr-4" : "ml-4"
              )
            : cn(
                "bg-surface",
                side === "right"
                  ? "border-l border-outline-variant"
                  : "border-r border-outline-variant"
              )
        )}
      >
        {children}
      </div>
    </aside>
  )
}

function SideSheetHeader({
  title,
  onBack,
  onClose,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode
  /** shows a back button before the title */
  onBack?: () => void
  /** shows a close button after the title */
  onClose?: () => void
}) {
  return (
    <div
      data-slot="side-sheet-header"
      className={cn(
        "flex min-h-16 items-center gap-1 py-2 pr-3 pl-6",
        onBack && "pl-3",
        className
      )}
      {...props}
    >
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Back"
          className="text-on-surface-variant"
          onClick={onBack}
        >
          <Icon name="arrow_back" />
        </Button>
      )}
      <h2
        data-slot="side-sheet-title"
        className="min-w-0 flex-1 truncate text-title-large text-on-surface-variant"
      >
        {title}
      </h2>
      {children}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close"
          className="text-on-surface-variant"
          onClick={onClose}
        >
          <Icon name="close" />
        </Button>
      )}
    </div>
  )
}

function SideSheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div
        data-slot="side-sheet-content"
        className={cn(
          "px-6 py-2 text-body-medium text-on-surface-variant",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ScrollArea>
  )
}

function SideSheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="side-sheet-footer"
      className={cn(
        "flex gap-2 border-t border-outline-variant px-6 py-4",
        className
      )}
      {...props}
    />
  )
}

export { SideSheet, SideSheetHeader, SideSheetContent, SideSheetFooter }
