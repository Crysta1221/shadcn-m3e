import type * as React from "react"
import { cn } from "@/lib/m3e/cn"

/**
 * M3 circular progress indicator (indeterminate). The arc grows and shrinks
 * while the whole ring rotates. Inherits `currentColor`; defaults to primary.
 * For the M3 Expressive shape-morphing indicator see `LoadingIndicator`.
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 48 48"
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn(
        "size-5 animate-[m3-spinner-rotate_1.568s_linear_infinite] text-primary",
        className
      )}
      {...props}
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        pathLength={100}
        className="origin-center animate-[m3-spinner-arc_1.333s_var(--md-sys-motion-easing-standard)_infinite] [stroke-dasharray:100]"
      />
    </svg>
  )
}

export { Spinner }
