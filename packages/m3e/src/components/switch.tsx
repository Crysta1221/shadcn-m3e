"use client"

import type * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { Icon } from "@/components/m3e/icon"
import { Ripple } from "@/components/m3e/ripple"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 switch: 52×32 track. The handle grows 16 → 24dp when selected and to
 * 28dp while pressed, moving on the spatial spring. With an UncheckedIcon the
 * handle stays 24dp while off so the glyph fits; icons are 16dp and centered.
 * `sm` is a compact 40×24 variant for dense UIs (not in the M3 spec).
 */
function Switch({
  className,
  size = "default",
  children,
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-outline bg-surface-container-highest focus-ring transition-shape outline-none",
        "after:absolute after:-inset-x-1 after:-inset-y-2",
        "data-[size=default]:h-8 data-[size=default]:w-13 data-[size=sm]:h-6 data-[size=sm]:w-10",
        "data-checked:border-primary data-checked:bg-primary",
        "aria-invalid:border-error",
        "data-disabled:cursor-not-allowed data-disabled:border-on-surface/12 data-disabled:bg-on-surface/12 data-disabled:data-unchecked:border-on-surface/12 data-disabled:data-unchecked:bg-surface-container-highest/12",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "state-layer-circle pointer-events-none absolute top-1/2 left-0 flex -translate-y-1/2 items-center justify-center rounded-full bg-outline transition-shape [transition-property:width,height,translate,background-color] state-layer-on-surface",
          // unchecked 16dp (centered 16dp from the outer left edge), checked 24dp, pressed 28dp
          "group-data-[size=default]/switch:size-4 group-data-[size=default]/switch:translate-x-1.5",
          "group-data-[size=default]/switch:data-checked:size-6 group-data-[size=default]/switch:data-checked:translate-x-[22px]",
          "group-data-[size=default]/switch:group-data-press/switch:size-7 group-data-[size=default]/switch:group-data-press/switch:translate-x-0 group-data-[size=default]/switch:group-data-press/switch:data-checked:translate-x-5",
          // UncheckedIcon: keep the handle at 24dp while off so the glyph fits
          // (only when unchecked — otherwise it would pin a checked thumb left)
          "group-data-[size=default]/switch:data-unchecked:has-data-[slot=switch-unchecked-icon]:size-6 group-data-[size=default]/switch:data-unchecked:has-data-[slot=switch-unchecked-icon]:translate-x-0.5",
          "group-data-[size=sm]/switch:size-3 group-data-[size=sm]/switch:translate-x-1 group-data-[size=sm]/switch:group-data-press/switch:size-5 group-data-[size=sm]/switch:group-data-press/switch:translate-x-0 group-data-[size=sm]/switch:data-checked:size-4 group-data-[size=sm]/switch:data-checked:translate-x-[18px] group-data-[size=sm]/switch:group-data-press/switch:data-checked:translate-x-4",
          "group-data-[size=sm]/switch:data-unchecked:has-data-[slot=switch-unchecked-icon]:size-4 group-data-[size=sm]/switch:data-unchecked:has-data-[slot=switch-unchecked-icon]:translate-x-0.5",
          "group-hover/switch:bg-on-surface-variant data-checked:bg-on-primary data-checked:state-layer-primary group-hover/switch:data-checked:bg-primary-container",
          "group-hover/switch:before:opacity-8 group-focus-visible/switch:before:opacity-10 group-data-press/switch:before:opacity-10",
          "group-data-disabled/switch:bg-on-surface/38 group-data-disabled/switch:before:opacity-0! group-data-disabled/switch:data-checked:bg-surface",
          "group-data-[size=sm]/switch:[--state-layer-size:32px]"
        )}
      >
        {children}
        <Ripple className="inset-auto top-1/2 left-1/2 size-10 -translate-1/2 rounded-full ripple-on-surface group-data-[size=sm]/switch:size-8 group-data-checked/switch:ripple-primary" />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

function CheckedIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="switch-checked-icon"
      className={cn(
        "absolute inset-0 hidden items-center justify-center text-on-primary-container group-data-checked/switch:flex group-data-disabled/switch:text-on-surface group-data-disabled/switch:opacity-38 [&_svg]:size-4",
        className
      )}
      {...props}
    >
      {children ?? <Icon name="check" />}
    </span>
  )
}

function UncheckedIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="switch-unchecked-icon"
      className={cn(
        "absolute inset-0 hidden items-center justify-center text-surface-container-highest group-data-unchecked/switch:flex group-data-disabled/switch:text-surface [&_svg]:size-4",
        className
      )}
      {...props}
    >
      {children ?? <Icon name="close" />}
    </span>
  )
}

export { Switch, CheckedIcon, UncheckedIcon }
