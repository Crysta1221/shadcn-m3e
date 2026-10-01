"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"
import { cn } from "@/lib/m3e/cn"
import { Ripple } from "@/components/m3e/ripple"
import { CheckIcon } from "@/components/m3e/symbols"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/m3e/dropdown-menu"

function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        "flex h-12 items-center gap-1 rounded-full bg-surface-container p-1",
        className
      )}
      {...props}
    />
  )
}

function MenubarMenu({ ...props }: React.ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPortal>) {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger>) {
  return (
    <DropdownMenuTrigger
      data-slot="menubar-trigger"
      className={cn(
        "state-layer flex h-10 items-center rounded-full px-4 text-label-large text-on-surface-variant focus-ring select-none aria-expanded:bg-secondary-container aria-expanded:text-on-secondary-container",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="menubar-content"
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "min-w-48 motion-menu rounded-lg bg-surface-container-low p-1 text-on-surface shadow-elevation-2",
        className
      )}
      {...props}
    />
  )
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/menubar-item relative min-h-11 gap-3 rounded-xs px-4 py-2 text-body-large transition-shape first:rounded-t-md last:rounded-b-md focus:bg-on-surface/10 data-inset:pl-11 data-[variant=destructive]:text-error data-[variant=destructive]:focus:bg-error/10 data-disabled:opacity-38 [&_svg:not([class*='size-'])]:size-5 data-[variant=destructive]:*:[svg]:text-error!",
        className
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex min-h-11 cursor-default items-center gap-3 rounded-xs py-2 pr-4 pl-11 text-body-large outline-hidden transition-shape select-none first:rounded-t-md last:rounded-b-md focus:bg-on-surface/10 data-inset:pl-11 data-checked:rounded-md data-checked:bg-tertiary-container data-checked:text-on-tertiary-container data-disabled:pointer-events-none data-disabled:opacity-38 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      checked={checked}
      {...props}
    >
      <Ripple />
      <span className="pointer-events-none absolute left-4 flex size-5 items-center justify-center [&_svg:not([class*='size-'])]:size-5">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />
}

function MenubarRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menubar-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex min-h-11 cursor-default items-center gap-3 rounded-xs py-2 pr-4 pl-11 text-body-large outline-hidden transition-shape select-none first:rounded-t-md last:rounded-b-md focus:bg-on-surface/10 data-inset:pl-11 data-checked:rounded-md data-checked:bg-tertiary-container data-checked:text-on-tertiary-container data-disabled:pointer-events-none data-disabled:opacity-38 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    >
      <Ripple />
      <span className="pointer-events-none absolute left-4 flex size-5 items-center justify-center [&_svg:not([class*='size-'])]:size-5">
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuLabel> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuLabel
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-4 pt-3 pb-1.5 text-label-large text-on-surface-variant data-inset:pl-11",
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) {
  return (
    <DropdownMenuSeparator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-0.5 bg-surface", className)}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return (
    <DropdownMenuShortcut
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-label-medium tracking-wider text-on-surface-variant",
        className
      )}
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuSub>) {
  return <DropdownMenuSub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuSubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "relative min-h-11 gap-3 rounded-xs px-4 py-2 text-body-large transition-shape first:rounded-t-md last:rounded-b-md focus:bg-on-surface/10 data-inset:pl-11 data-open:bg-on-surface/10 [&_svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    />
  )
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubContent>) {
  return (
    <DropdownMenuSubContent
      data-slot="menubar-sub-content"
      className={cn(
        "min-w-32 motion-menu rounded-lg bg-surface-container-low p-1 text-on-surface shadow-elevation-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
