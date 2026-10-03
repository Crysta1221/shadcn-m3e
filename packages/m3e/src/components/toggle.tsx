import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/m3e/cn"

import { Ripple } from "@/components/m3e/ripple"

/*
 * M3 Expressive toggle button. Selecting it swaps its shape
 * (round → square, or square → round) and its container color.
 * Base UI marks the selected state with `data-pressed`.
 */
const toggleVariants = cva(
  "group/toggle state-layer relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-(--btn-r) border border-transparent text-label-large whitespace-nowrap focus-ring transition-shape outline-none select-none disabled:pointer-events-none disabled:bg-on-surface/10! disabled:text-on-surface/38! data-press:rounded-(--btn-r-pressed) data-pressed:rounded-(--btn-r-selected) data-pressed:data-press:rounded-(--btn-r-pressed) [&_svg]:pointer-events-none [&_svg]:shrink-0 [&>*:not([data-slot=ripple])]:relative [&>*:not([data-slot=ripple])]:z-1",
  {
    variants: {
      variant: {
        /* standard (M3E icon toggle): no container, selected content in primary */
        default:
          "bg-transparent text-on-surface-variant disabled:bg-transparent! data-pressed:text-primary",
        filled:
          "bg-surface-container text-on-surface-variant data-pressed:bg-primary data-pressed:text-on-primary",
        tonal:
          "bg-secondary-container text-on-secondary-container data-pressed:bg-secondary data-pressed:text-on-secondary",
        outline:
          "border-outline-variant bg-transparent text-on-surface-variant data-pressed:border-transparent data-pressed:bg-inverse-surface data-pressed:text-inverse-on-surface",
        elevated:
          "bg-surface-container-low text-primary shadow-elevation-1 data-pressed:bg-primary data-pressed:text-on-primary",
      },
      size: {
        xs: "h-8 min-w-8 px-3 [--btn-h2:16px] [--btn-r-pressed:var(--radius-sm)] [--btn-r-selected:var(--radius-md)] [--btn-r:16px] [&_svg:not([class*='size-'])]:size-5",
        sm: "h-10 min-w-10 px-4 [--btn-h2:20px] [--btn-r-pressed:var(--radius-sm)] [--btn-r-selected:var(--radius-md)] [--btn-r:20px] [&_svg:not([class*='size-'])]:size-5",
        default:
          "h-10 min-w-10 px-4 [--btn-h2:20px] [--btn-r-pressed:var(--radius-sm)] [--btn-r-selected:var(--radius-md)] [--btn-r:20px] [&_svg:not([class*='size-'])]:size-5",
        md: "h-14 min-w-14 px-6 text-title-medium [--btn-h2:28px] [--btn-r-pressed:var(--radius-md)] [--btn-r-selected:var(--radius-lg)] [--btn-r:28px] [&_svg:not([class*='size-'])]:size-6",
        lg: "h-24 min-w-24 px-12 text-headline-small [--btn-h2:48px] [--btn-r-pressed:var(--radius-lg)] [--btn-r-selected:var(--radius-2xl)] [--btn-r:48px] [&_svg:not([class*='size-'])]:size-8",
      },
      shape: {
        round: "",
        /* square at rest, round when selected */
        square:
          "[--btn-r:var(--btn-r-square,var(--radius-md))] data-pressed:rounded-(--btn-h2)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "round",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  shape = "round",
  children,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, shape, className }))}
      {...props}
    >
      <Ripple />
      {children}
    </TogglePrimitive>
  )
}

export { Toggle, toggleVariants }
