import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/m3e/cn"

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-on-primary [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80",
        secondary:
          "*:data-[slot=bubble-content]:bg-secondary-container *:data-[slot=bubble-content]:text-on-secondary-container [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_srgb,var(--md-sys-color-on-secondary-container)_8%,var(--md-sys-color-secondary-container))]",
        muted:
          "*:data-[slot=bubble-content]:bg-surface-container-highest [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
        tinted:
          "*:data-[slot=bubble-content]:bg-primary-container *:data-[slot=bubble-content]:text-on-primary-container [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_srgb,var(--md-sys-color-on-primary-container)_8%,var(--md-sys-color-primary-container))]",
        outline:
          "*:data-[slot=bubble-content]:border-outline-variant *:data-[slot=bubble-content]:bg-surface [&>[data-slot=bubble-content]:is(button,a):hover]:bg-surface-container-highest [&>[data-slot=bubble-content]:is(button,a):hover]:text-on-surface dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-transparent",
        ghost:
          "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-surface-container-highest [&>[data-slot=bubble-content]:is(button,a):hover]:text-on-surface dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-surface-container-low",
        destructive:
          "*:data-[slot=bubble-content]:bg-error-container *:data-[slot=bubble-content]:text-error [&>[data-slot=bubble-content]:is(button,a):hover]:bg-error-container",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "w-fit max-w-full min-w-0 overflow-hidden rounded-3xl border border-transparent px-3.5 py-2.5 text-body-medium leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-left [button,a]:focus-ring [button,a]:transition-colors [button,a]:outline-none",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  })
}

const bubbleReactionsVariants = cva(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-surface-container-highest px-1.5 py-0.5 text-body-medium ring-3 ring-surface has-[button]:p-0",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "left-3",
        end: "right-3",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  }
)

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }
