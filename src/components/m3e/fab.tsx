import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { Ripple } from "@/components/m3e/ripple"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 Expressive FAB and extended FAB (Compose Fab / ExtendedFab tokens).
 *   FAB:           S 40 (12dp)  · 56 (16dp) · M 80 (20dp) · L 96 (28dp)
 *   Extended FAB:  S 56 (16dp)  · M 80 (20dp) · L 96 (28dp)
 * Elevation 3 (lowered: 1), hover +1 level.
 */
const fabVariants = cva(
  "group/fab state-layer relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap shadow-elevation-3 focus-ring transition-shape outline-none select-none hover:shadow-elevation-4 disabled:pointer-events-none disabled:bg-on-surface/10 disabled:text-on-surface/38 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&>*:not([data-slot=ripple])]:relative",
  {
    variants: {
      color: {
        "primary-container": "bg-primary-container text-on-primary-container",
        "secondary-container":
          "bg-secondary-container text-on-secondary-container",
        "tertiary-container":
          "bg-tertiary-container text-on-tertiary-container",
        primary: "bg-primary text-on-primary",
        secondary: "bg-secondary text-on-secondary",
        tertiary: "bg-tertiary text-on-tertiary",
        surface: "bg-surface-container-high text-primary",
      },
      size: {
        sm: "size-10 rounded-md [--icon-size:24px] [&_svg:not([class*='size-'])]:size-6",
        default:
          "size-14 rounded-lg [--icon-size:24px] [&_svg:not([class*='size-'])]:size-6",
        md: "size-20 rounded-xl [--icon-size:28px] [&_svg:not([class*='size-'])]:size-7",
        lg: "size-24 rounded-2xl [--icon-size:32px] [&_svg:not([class*='size-'])]:size-8",
      },
      lowered: {
        true: "shadow-elevation-1 hover:shadow-elevation-2",
        false: "",
      },
    },
    defaultVariants: {
      color: "primary-container",
      size: "default",
      lowered: false,
    },
  }
)

const extendedFabSizes = {
  sm: "h-14 gap-2 rounded-lg px-4 text-title-medium [&_svg:not([class*='size-'])]:size-6",
  default:
    "h-14 gap-2 rounded-lg px-4 text-title-medium [&_svg:not([class*='size-'])]:size-6",
  md: "h-20 gap-4 rounded-xl px-6.5 text-title-large [&_svg:not([class*='size-'])]:size-7",
  lg: "h-24 gap-5 rounded-2xl px-7 text-headline-small [&_svg:not([class*='size-'])]:size-8",
} as const

type FabProps = Omit<ButtonPrimitive.Props, "color"> &
  VariantProps<typeof fabVariants>

function Fab({
  className,
  color,
  size,
  lowered,
  children,
  ...props
}: FabProps) {
  return (
    <ButtonPrimitive
      data-slot="fab"
      className={cn(fabVariants({ color, size, lowered }), className)}
      {...props}
    >
      <Ripple />
      {children}
    </ButtonPrimitive>
  )
}

type ExtendedFabProps = FabProps & {
  /** the icon; the label is `children` */
  icon?: React.ReactNode
  /** collapse to a plain FAB (e.g. while scrolling), keeping the icon */
  collapsed?: boolean
}

function ExtendedFab({
  className,
  color,
  size = "default",
  lowered,
  icon,
  collapsed,
  children,
  ...props
}: ExtendedFabProps) {
  return (
    <ButtonPrimitive
      data-slot="extended-fab"
      data-collapsed={collapsed || undefined}
      className={cn(
        fabVariants({ color, lowered, size: null }),
        extendedFabSizes[size ?? "default"],
        "data-collapsed:aspect-square data-collapsed:gap-0 data-collapsed:px-0",
        className
      )}
      {...props}
    >
      <Ripple />
      {icon}
      <span
        className={cn(
          "grid transition-[grid-template-columns,opacity] duration-(--md-sys-motion-spring-default-spatial-duration) ease-spatial-default",
          collapsed ? "grid-cols-[0fr] opacity-0" : "grid-cols-[1fr]"
        )}
      >
        <span className="overflow-hidden">{children}</span>
      </span>
    </ButtonPrimitive>
  )
}

export { Fab, ExtendedFab, fabVariants }
