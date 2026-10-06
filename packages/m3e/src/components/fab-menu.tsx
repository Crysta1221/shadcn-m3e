import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cn } from "@/lib/m3e/cn"

import { fabVariants } from "@/components/m3e/fab"
import { Icon } from "@/components/m3e/icon"
import { Ripple } from "@/components/m3e/ripple"

/*
 * M3 Expressive FAB menu (Compose FabMenu tokens): a FAB that opens a stack of
 * up to six pill actions. While open the FAB becomes a 56dp primary circle
 * with a close icon; the items are 56dp tall pills with 24dp side padding,
 * 8dp between icon and label, 4dp apart, elevation 3, and spring in one after
 * the other, nearest the FAB first.
 */
type FabMenuContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  count: React.RefObject<number>
}
const FabMenuContext = React.createContext<FabMenuContextValue | null>(null)

function useFabMenu() {
  const ctx = React.useContext(FabMenuContext)
  if (!ctx) throw new Error("FabMenu parts must be used inside <FabMenu>")
  return ctx
}

type FabMenuProps = React.ComponentProps<"div"> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function FabMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}: FabMenuProps) {
  const [inner, setInner] = React.useState(defaultOpen)
  const open = openProp ?? inner
  const ref = React.useRef<HTMLDivElement>(null)
  const count = React.useRef(0)

  const setOpen = React.useCallback(
    (next: boolean) => {
      setInner(next)
      onOpenChange?.(next)
    },
    [onOpenChange]
  )

  React.useEffect(() => {
    if (!open) return undefined
    const onDown = (e: PointerEvent) => {
      if (!(e.target instanceof Node && ref.current?.contains(e.target)))
        setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open, setOpen])

  return (
    <FabMenuContext.Provider value={{ open, setOpen, count }}>
      <div
        ref={ref}
        data-slot="fab-menu"
        data-open={open || undefined}
        className={cn("relative inline-flex flex-col", className)}
        {...props}
      >
        {children}
      </div>
    </FabMenuContext.Provider>
  )
}

type FabMenuTriggerProps = Omit<ButtonPrimitive.Props, "color"> & {
  /** the icon while closed; the open state always shows a close icon */
  icon?: React.ReactNode
}

function FabMenuTrigger({
  className,
  icon,
  children,
  ...props
}: FabMenuTriggerProps) {
  const { open, setOpen } = useFabMenu()
  return (
    <ButtonPrimitive
      data-slot="fab-menu-trigger"
      aria-expanded={open}
      aria-haspopup="menu"
      onClick={() => setOpen(!open)}
      className={cn(
        fabVariants({
          color: open ? "primary" : "primary-container",
          size: "default",
        }),
        "transition-[border-radius,background-color,color,box-shadow,width] motion-spatial-fast",
        open && "rounded-[28px]",
        className
      )}
      {...props}
    >
      <Ripple />
      <span className="relative grid size-6 place-items-center">
        <span
          className={cn(
            "absolute transition-[opacity,transform] motion-effects-default",
            open ? "scale-50 rotate-90 opacity-0" : "scale-100 opacity-100"
          )}
        >
          {icon ?? <Icon name="add" />}
        </span>
        <span
          className={cn(
            "absolute transition-[opacity,transform] motion-effects-default",
            open ? "scale-100 opacity-100" : "scale-50 -rotate-90 opacity-0"
          )}
        >
          <Icon name="close" size={20} />
        </span>
      </span>
      {children}
    </ButtonPrimitive>
  )
}

/** the stack of items; sits above the trigger, right-aligned */
function FabMenuContent({
  className,
  children,
  align = "end",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  const { open } = useFabMenu()
  const items = React.Children.toArray(children)
  return (
    <div
      role="menu"
      data-slot="fab-menu-content"
      data-open={open || undefined}
      className={cn(
        "absolute bottom-full mb-2 flex flex-col gap-1",
        align === "end" ? "right-0 items-end" : "left-0 items-start",
        !open && "pointer-events-none",
        className
      )}
      {...props}
    >
      {items.map((child, i) =>
        React.isValidElement<{ style?: React.CSSProperties }>(child)
          ? React.cloneElement(child, {
              // the item nearest the FAB (last) springs in first
              style: {
                ...child.props.style,
                "--i": items.length - 1 - i,
              } as React.CSSProperties,
            })
          : child
      )}
    </div>
  )
}

type FabMenuItemProps = Omit<ButtonPrimitive.Props, "color"> & {
  icon?: React.ReactNode
}

function FabMenuItem({
  className,
  icon,
  children,
  onClick,
  ...props
}: FabMenuItemProps) {
  const { open, setOpen } = useFabMenu()
  return (
    <ButtonPrimitive
      role="menuitem"
      data-slot="fab-menu-item"
      tabIndex={open ? 0 : -1}
      onClick={(e) => {
        onClick?.(e)
        setOpen(false)
      }}
      className={cn(
        "state-layer relative inline-flex h-14 cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-primary-container px-6 text-title-medium whitespace-nowrap text-on-primary-container shadow-elevation-3 focus-ring outline-none",
        "transition-[opacity,transform,box-shadow] [transition-delay:calc(var(--i,0)*35ms)] motion-spatial-default",
        open
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-4 scale-75 opacity-0 [transition-delay:0ms]",
        "[&_svg]:size-6",
        className
      )}
      {...props}
    >
      <Ripple />
      {icon}
      {children}
    </ButtonPrimitive>
  )
}

export { FabMenu, FabMenuTrigger, FabMenuContent, FabMenuItem }
