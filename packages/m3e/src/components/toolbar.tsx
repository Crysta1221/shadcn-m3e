import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 Expressive toolbars (Compose FloatingToolbar / DockedToolbar tokens).
 *
 *   FloatingToolbar — 64dp pill, elevation 3, 8dp padding, 4dp between items,
 *                     16dp from the screen edge. `standard` is
 *                     surface-container; `vibrant` is primary-container with
 *                     on-primary-container content. Selected buttons in the
 *                     vibrant toolbar sit on surface-container.
 *   DockedToolbar   — full-width 64dp bar on surface-container, 16dp side
 *                     padding, items spread 4–32dp apart.
 *
 * Put icon buttons (`<Button variant="text" size="icon">`) or toggles
 * (`<Toggle>`) inside; they pick up the toolbar's colors.
 */
const CONTENT =
  // buttons and toggles inherit the toolbar content color, and their selected
  // state reads from the container
  "[&_[data-slot=button]]:bg-transparent [&_[data-slot=toggle]]:bg-transparent"

const toolbarItems = (element: HTMLDivElement) =>
  Array.from(
    element.querySelectorAll<HTMLElement>(
      'button:not([disabled]):not([aria-disabled="true"]),a[href],input:not([disabled])'
    )
  ).filter(
    (item) =>
      item.closest('[role="toolbar"]') === element &&
      !item.closest("[inert],[hidden]")
  )

function ToolbarSurface({
  orientation = "horizontal",
  onKeyDown,
  onFocusCapture,
  ref,
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  const root = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const element = root.current
    if (!element) return undefined
    const update = () => {
      const controls = toolbarItems(element)
      const active =
        controls.find((item) => item === document.activeElement) ??
        controls.find((item) => item.tabIndex === 0) ??
        controls[0]
      controls.forEach((item) => {
        item.tabIndex = item === active ? 0 : -1
      })
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(element, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={(element) => {
        root.current = element
        if (typeof ref === "function") return ref(element)
        if (ref) ref.current = element
      }}
      role="toolbar"
      tabIndex={-1}
      aria-orientation={orientation}
      onFocusCapture={(event) => {
        onFocusCapture?.(event)
        toolbarItems(event.currentTarget).forEach((item) => {
          item.tabIndex = item === document.activeElement ? 0 : -1
        })
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (
          event.defaultPrevented ||
          !(event.target instanceof HTMLElement) ||
          event.target.matches('input,textarea,[contenteditable="true"]')
        )
          return
        const controls = toolbarItems(event.currentTarget)
        const current = controls.findIndex(
          (item) => item === document.activeElement
        )
        const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
        const forward =
          orientation === "vertical"
            ? "ArrowDown"
            : rtl
              ? "ArrowLeft"
              : "ArrowRight"
        const back =
          orientation === "vertical"
            ? "ArrowUp"
            : rtl
              ? "ArrowRight"
              : "ArrowLeft"
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? controls.length - 1
              : event.key === forward
                ? (current + 1) % controls.length
                : event.key === back
                  ? (current - 1 + controls.length) % controls.length
                  : -1
        if (next < 0) return
        event.preventDefault()
        controls[next]?.focus()
      }}
      {...props}
    />
  )
}

const floatingToolbarVariants = cva(
  `inline-flex items-center gap-1 rounded-full p-2 shadow-elevation-3 ${CONTENT}`,
  {
    variants: {
      variant: {
        standard:
          "bg-surface-container text-on-surface-variant [&_[data-slot=button]]:text-on-surface-variant [&_[data-slot=toggle]]:text-on-surface-variant [&_[data-slot=toggle][data-pressed]]:bg-secondary-container [&_[data-slot=toggle][data-pressed]]:text-on-secondary-container",
        vibrant:
          "bg-primary-container text-on-primary-container [&_[data-slot=button]]:text-on-primary-container [&_[data-slot=toggle]]:text-on-primary-container [&_[data-slot=toggle][data-pressed]]:bg-surface-container [&_[data-slot=toggle][data-pressed]]:text-on-surface",
      },
      orientation: {
        horizontal: "h-16",
        vertical: "w-16 flex-col",
      },
    },
    defaultVariants: { variant: "standard", orientation: "horizontal" },
  }
)

type FloatingToolbarProps = React.ComponentProps<"div"> &
  VariantProps<typeof floatingToolbarVariants>

function FloatingToolbar({
  className,
  variant,
  orientation,
  ...props
}: FloatingToolbarProps) {
  return (
    <ToolbarSurface
      role="toolbar"
      orientation={orientation ?? "horizontal"}
      aria-orientation={orientation ?? "horizontal"}
      data-slot="floating-toolbar"
      data-variant={variant ?? "standard"}
      className={cn(
        floatingToolbarVariants({ variant, orientation }),
        className
      )}
      {...props}
    />
  )
}

function DockedToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <ToolbarSurface
      role="toolbar"
      data-slot="docked-toolbar"
      className={cn(
        "flex h-16 w-full items-center justify-between gap-1 bg-surface-container px-4 text-on-surface-variant [&_[data-slot=button]]:text-on-surface-variant",
        className
      )}
      {...props}
    />
  )
}

export { FloatingToolbar, DockedToolbar, floatingToolbarVariants }
