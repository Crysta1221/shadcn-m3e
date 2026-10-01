import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/m3e/cn"

import { Ripple } from "@/components/m3e/ripple"

/* M3 cards: filled, elevated and outlined, medium (12dp) corners */
const cardVariants = cva(
  "group/card relative flex flex-col gap-(--card-spacing) overflow-hidden rounded-md py-(--card-spacing) text-body-medium text-on-surface transition-shape [--card-spacing:--spacing(4)] has-[>img:first-child]:pt-0 data-[size=lg]:[--card-spacing:--spacing(6)] data-[size=sm]:[--card-spacing:--spacing(3)] *:[img:first-child]:rounded-t-md *:[img:last-child]:rounded-b-md",
  {
    variants: {
      variant: {
        filled: "bg-surface-container-highest",
        elevated: "bg-surface-container-low shadow-elevation-1",
        outlined: "border border-outline-variant bg-surface",
      },
      /* adds hover/press feedback for clickable cards */
      interactive: {
        true: "state-layer cursor-pointer focus-ring",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "elevated",
        interactive: true,
        className: "hover:shadow-elevation-2 data-press:shadow-elevation-1",
      },
      {
        variant: "filled",
        interactive: true,
        className: "hover:shadow-elevation-1 data-press:shadow-none",
      },
    ],
    defaultVariants: {
      variant: "filled",
      interactive: false,
    },
  }
)

function Card({
  className,
  size = "default",
  variant,
  interactive,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & { size?: "default" | "sm" | "lg" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant ?? "filled"}
      className={cn(cardVariants({ variant, interactive }), className)}
      {...props}
    >
      {interactive && <Ripple />}
      {children}
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-heading text-title-large text-on-surface", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-body-medium text-on-surface-variant", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-2 px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
