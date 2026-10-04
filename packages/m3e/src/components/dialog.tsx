"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/m3e/cn"
import { CloseIcon } from "@/components/m3e/symbols"

import { Button } from "@/components/m3e/button"
import { usePortalContainer } from "@/components/m3e/portal-container"

/*
 * M3 dialogs come in two styles (https://m3.material.io/components/dialogs/specs):
 *
 * Basic dialog (the default): surface-container-high, 28dp corners, elevation 3,
 *   24dp padding, 280-560dp wide. Optional icon (24dp, secondary, centers the
 *   headline), headline (headline-small, on-surface), supporting text
 *   (body-medium, on-surface-variant), optional divider between a scrolling body
 *   and the actions, and text buttons (primary) 8dp apart. Spacing: icon 16dp
 *   above the headline, headline 16dp above the text, text 24dp above the actions.
 *   Tokens: Compose DialogTokens.
 *
 * Full-screen dialog (`variant="fullscreen"`): 0dp corners, the whole screen
 *   (the spec says to use it on compact windows only), a 56dp header with the close icon, the headline and a
 *   text button, an optional divider under it, and an optional 56dp action bar
 *   (DialogFooter). 24dp side padding, 8dp between elements. The spec has no
 *   Compose tokens for it, the numbers come from the spec page.
 */

type DialogVariant = "basic" | "fullscreen"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  const container = usePortalContainer()
  return (
    <DialogPrimitive.Portal
      container={container}
      data-slot="dialog-portal"
      {...props}
    />
  )
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-scrim/32 motion-scrim",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  variant = "basic",
  showCloseButton = variant === "basic",
  ...props
}: DialogPrimitive.Popup.Props & {
  /** "basic" is the centered card; "fullscreen" fills its container, with a header */
  variant?: DialogVariant
  /** a close button in the corner; a full-screen dialog has its own in the header */
  showCloseButton?: boolean
}) {
  const fullscreen = variant === "fullscreen"
  return (
    <DialogPortal>
      {!fullscreen && <DialogOverlay />}
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-variant={variant}
        className={cn(
          "group/dialog fixed z-50 flex motion-dialog flex-col text-body-medium text-on-surface-variant outline-none",
          fullscreen
            ? "inset-0 bg-surface-container-high"
            : "top-1/2 left-1/2 max-h-[calc(100%-3rem)] w-full max-w-[min(calc(100%-3rem),560px)] min-w-[280px] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl bg-surface-container-high p-6 shadow-elevation-3 sm:max-w-md",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3 right-3"
                size="icon"
              />
            }
          >
            <CloseIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

/** The icon above the headline of a basic dialog: 24dp, secondary. It centers the headline. */
function DialogIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-icon"
      className={cn(
        "flex justify-center text-secondary [&_svg:not([class*='size-'])]:size-6",
        className
      )}
      {...props}
    />
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

/**
 * What a dialog says, between its headline and its actions. When it is taller
 * than the dialog it scrolls, and a divider appears on each edge that has more
 * behind it.
 */
function DialogBody({
  className,
  onScroll,
  ...props
}: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [more, setMore] = React.useState({ above: false, below: false })

  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    const above = el.scrollTop > 0
    const below = el.scrollTop + el.clientHeight < el.scrollHeight - 1
    setMore((m) =>
      m.above === above && m.below === below ? m : { above, below }
    )
  }, [])

  React.useEffect(() => {
    measure()
    const el = ref.current
    if (!el || typeof ResizeObserver === "undefined") return undefined
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div
      ref={ref}
      data-slot="dialog-body"
      data-more-above={more.above ? "" : undefined}
      data-more-below={more.below ? "" : undefined}
      onScroll={(e) => {
        measure()
        onScroll?.(e)
      }}
      className={cn(
        "min-h-0 flex-1 overflow-y-auto border-y border-transparent transition-[border-color] group-data-[variant=fullscreen]/dialog:px-6 group-data-[variant=fullscreen]/dialog:py-4 data-more-above:border-t-outline-variant data-more-below:border-b-outline-variant",
        className
      )}
      {...props}
    />
  )
}

/** A 1dp divider, for a dialog whose body does not scroll but wants one anyway. */
function DialogDivider({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      data-slot="dialog-divider"
      className={cn("h-px shrink-0 bg-outline-variant", className)}
      {...props}
    />
  )
}

/**
 * The header of a full-screen dialog, 56dp: the close icon, the headline and a
 * text button. Put `DialogClose` around the icon button.
 */
function DialogTopBar({
  className,
  divider = false,
  ...props
}: React.ComponentProps<"div"> & { divider?: boolean }) {
  return (
    <div
      data-slot="dialog-topbar"
      data-divider={divider ? "" : undefined}
      className={cn(
        "flex h-14 shrink-0 items-center gap-2 border-b border-transparent px-6 data-divider:border-b-outline-variant",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  stacked = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
  /** one button above the other, the confirming one on top: for long labels */
  stacked?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      data-stacked={stacked ? "" : undefined}
      className={cn(
        "mt-2 flex flex-col-reverse gap-2 data-stacked:flex-col-reverse data-stacked:items-end sm:flex-row sm:justify-end sm:data-stacked:flex-col-reverse sm:data-stacked:items-end sm:data-stacked:justify-start",
        "group-data-[variant=fullscreen]/dialog:mt-0 group-data-[variant=fullscreen]/dialog:h-14 group-data-[variant=fullscreen]/dialog:shrink-0 group-data-[variant=fullscreen]/dialog:flex-row group-data-[variant=fullscreen]/dialog:items-center group-data-[variant=fullscreen]/dialog:justify-end group-data-[variant=fullscreen]/dialog:border-t group-data-[variant=fullscreen]/dialog:border-outline-variant group-data-[variant=fullscreen]/dialog:px-6",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="text" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-headline-small text-on-surface group-has-data-[slot=dialog-icon]/dialog:text-center in-data-[slot=dialog-topbar]:flex-1 in-data-[slot=dialog-topbar]:text-title-large",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-body-medium text-on-surface-variant *:[a]:text-primary *:[a]:underline *:[a]:underline-offset-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogDivider,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTopBar,
  DialogTrigger,
}
export type { DialogVariant }
