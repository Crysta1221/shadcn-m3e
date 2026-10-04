"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "@/lib/m3e/cn"
import { Ripple } from "@/components/m3e/ripple"
import {
  ArrowDropDownIcon,
  CheckIcon,
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
} from "@/components/m3e/symbols"
import { usePortalContainer } from "@/components/m3e/portal-container"

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

/*
 * M3 select (Compose ExposedDropdownMenuBox / text field tokens). The
 * trigger is a 56dp field in the two field styles:
 *   outlined — 1dp outline, extra-small corners; the label floats into a
 *              notch on the border
 *   filled   — surface-container-highest, extra-small top corners, 1dp
 *              active indicator; the label floats to the top inside
 * `supporting` is the helper text under the field.
 */
function SelectTrigger({
  className,
  size = "default",
  variant = "outlined",
  label,
  supporting,
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
  variant?: "outlined" | "filled"
  /** floats above the field, the text field's label position */
  label?: React.ReactNode
  /** helper text under the field */
  supporting?: React.ReactNode
}) {
  const filled = variant === "filled"
  const trigger = (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      data-variant={variant}
      className={cn(
        "group/select-trigger flex w-fit min-w-40 items-center justify-between gap-2 text-body-large whitespace-nowrap text-on-surface transition-shape outline-none disabled:cursor-not-allowed data-placeholder:text-on-surface-variant data-[size=default]:h-14 data-[size=sm]:h-10 data-[size=sm]:text-body-medium *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        filled
          ? "rounded-t-xs border-b border-on-surface-variant bg-surface-container-highest hover:border-on-surface focus-visible:border-primary focus-visible:shadow-[inset_0_-1px_0_0_var(--md-sys-color-primary)] disabled:border-on-surface/12 disabled:text-on-surface/38 aria-invalid:border-error data-popup-open:border-primary data-popup-open:shadow-[inset_0_-1px_0_0_var(--md-sys-color-primary)]"
          : "rounded-xs border border-outline bg-transparent hover:border-on-surface focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--md-sys-color-primary)] disabled:border-on-surface/12 disabled:text-on-surface/38 aria-invalid:border-error data-popup-open:border-primary data-popup-open:shadow-[inset_0_0_0_1px_var(--md-sys-color-primary)]",
        label && filled
          ? size === "sm"
            ? "px-3 pt-4 pb-1"
            : "px-4 pt-6 pb-2"
          : "px-4 py-2 data-[size=sm]:px-3",
        label && "relative",
        className
      )}
      {...props}
    >
      {label && (
        <span
          data-slot="select-label"
          aria-hidden
          className={cn(
            "pointer-events-none absolute text-label-small text-on-surface-variant",
            filled
              ? "top-1.5 left-4 group-data-[size=sm]/select-trigger:top-1"
              : "top-0 left-3 -translate-y-1/2 bg-surface px-1"
          )}
        >
          {label}
        </span>
      )}
      {children}
      <SelectPrimitive.Icon
        render={
          <ArrowDropDownIcon className="pointer-events-none size-5 text-on-surface-variant transition-transform duration-(--md-sys-motion-spring-fast-spatial-duration) ease-spatial-fast group-data-popup-open/select-trigger:rotate-180" />
        }
      />
    </SelectPrimitive.Trigger>
  )
  if (!supporting) return trigger
  return (
    <span data-slot="select-field" className="inline-flex w-fit flex-col gap-1">
      {trigger}
      <span
        data-slot="select-supporting"
        className="px-4 text-body-small text-on-surface-variant"
      >
        {supporting}
      </span>
    </span>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  const container = usePortalContainer()
  return (
    <SelectPrimitive.Portal container={container}>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 motion-menu overflow-x-hidden overflow-y-auto rounded-lg bg-surface-container-low text-on-surface shadow-elevation-2",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        "px-4 pt-3 pb-1.5 text-label-large text-on-surface-variant",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex min-h-11 w-full cursor-default items-center gap-3 rounded-xs py-2 pr-10 pl-4 text-body-large outline-hidden transition-shape select-none first:rounded-t-md last:rounded-b-md data-highlighted:bg-on-surface/10 data-[selected]:rounded-md data-[selected]:bg-tertiary-container data-[selected]:text-on-tertiary-container data-[selected]:data-highlighted:bg-[color-mix(in_srgb,var(--md-sys-color-on-tertiary-container)_10%,var(--md-sys-color-tertiary-container))] data-checked:rounded-md data-checked:bg-tertiary-container data-checked:text-on-tertiary-container data-disabled:pointer-events-none data-disabled:opacity-38 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <Ripple />
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-4 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none -mx-1 my-1 h-0.5 bg-surface",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-surface-container py-1 [&_svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    >
      <KeyboardArrowUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-surface-container py-1 [&_svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    >
      <KeyboardArrowDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
