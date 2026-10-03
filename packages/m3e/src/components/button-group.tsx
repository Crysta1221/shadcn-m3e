import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/m3e/cn"

import { Separator } from "@/components/m3e/separator"
import { useStandardGroup } from "@/components/m3e/use-standard-group"

/*
 * M3 Expressive button groups (Compose ButtonGroup / ConnectedButtonGroup).
 *  connected: 2dp gaps, small (8dp) inner corners that shrink to extra-small
 *             while pressed, full outer corners
 *  standard:  12dp gaps, children keep their own shapes; the pressed button
 *             grows by 15% and its neighbours make room (useStandardGroup)
 */
const H_OUTER_START =
  "[&>[data-slot]:first-child]:rounded-l-(--btn-h2,1.25rem) [&>[data-slot]:first-child]:data-press:rounded-l-(--btn-h2,1.25rem)"
const H_OUTER_END =
  "[&>[data-slot]:last-child]:rounded-r-(--btn-h2,1.25rem) [&>[data-slot]:last-child]:data-press:rounded-r-(--btn-h2,1.25rem)"

const buttonGroupVariants = cva(
  "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      variant: {
        connected: "gap-0.5",
        standard: "items-center gap-3 *:overflow-hidden",
      },
      orientation: {
        horizontal: "",
        vertical: "flex-col",
      },
    },
    compoundVariants: [
      {
        variant: "connected",
        orientation: "horizontal",
        className: `*:data-slot:rounded-sm *:data-slot:data-press:rounded-xs ${H_OUTER_START} ${H_OUTER_END}`,
      },
      {
        variant: "connected",
        orientation: "vertical",
        className:
          "*:data-slot:rounded-sm *:data-slot:data-press:rounded-xs [&>[data-slot]:first-child]:rounded-t-2xl [&>[data-slot]:first-child]:data-press:rounded-t-2xl [&>[data-slot]:last-child]:rounded-b-2xl [&>[data-slot]:last-child]:data-press:rounded-b-2xl",
      },
    ],
    defaultVariants: {
      variant: "connected",
      orientation: "horizontal",
    },
  }
)

function ButtonGroup({
  className,
  orientation,
  variant,
  ref,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  const groupRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref, () => groupRef.current!)
  useStandardGroup(
    groupRef,
    variant === "standard" && orientation !== "vertical"
  )
  return (
    <div
      ref={groupRef}
      role="group"
      data-slot="button-group"
      data-variant={variant ?? "connected"}
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ variant, orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex items-center gap-2 rounded-sm bg-surface-container-high px-4 text-label-large text-on-surface-variant [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  })
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative self-stretch bg-outline-variant data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
