import type * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/m3e/cn"

/*
 * Compact M3 label (chip-shaped). For notification counts see
 * `NotificationBadge`, for interactive chips see `Chip` (components/m3e).
 */
const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border border-transparent px-2 text-label-medium whitespace-nowrap focus-ring transition-shape has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-error [&>svg]:pointer-events-none [&>svg]:size-4!",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary [a]:state-layer",
        secondary:
          "bg-secondary-container text-on-secondary-container [a]:state-layer",
        tertiary:
          "bg-tertiary-container text-on-tertiary-container [a]:state-layer",
        destructive: "bg-error text-on-error [a]:state-layer",
        outline:
          "border-outline-variant bg-transparent text-on-surface-variant [a]:state-layer",
        ghost: "state-layer text-on-surface-variant",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

/*
 * M3 notification badge (Compose BadgeTokens): a 6dp error dot, or a 16dp
 * high pill with a Label Small count. Position it over an icon.
 */
function NotificationBadge({
  count,
  max = 999,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  /** omit for the small dot */
  count?: number | string
  /** counts above this show as `{max}+` */
  max?: number
}) {
  const large = count !== undefined && count !== ""
  const text = typeof count === "number" && count > max ? `${max}+` : count
  return (
    <span
      data-slot="notification-badge"
      role={large ? "status" : undefined}
      aria-label={large ? `${text} notifications` : "New notification"}
      className={cn(
        "z-2 inline-flex items-center justify-center rounded-full bg-error text-on-error",
        large ? "h-4 min-w-4 px-1 text-label-small" : "size-1.5",
        className
      )}
      {...props}
    >
      {large ? text : null}
    </span>
  )
}

export { Badge, NotificationBadge, badgeVariants }
