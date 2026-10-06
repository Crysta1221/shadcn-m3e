import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Icon } from "@/components/m3e/icon"
import { Button, type ButtonProps } from "@/components/m3e/button"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 Expressive split button (Compose SplitButton* tokens): a leading action
 * and a trailing menu button 2dp apart. Outer corners are full, inner corners
 * extra-small, growing on press; while the menu is open the trailing button
 * turns into a circle and its arrow flips.
 */
const splitSizes = {
  xs: {
    height: 32,
    inner: "4px",
    pressed: "8px",
    lead: "pl-3 pr-2.5",
    trail: "w-8 px-0",
    icon: 20,
  },
  sm: {
    height: 40,
    inner: "4px",
    pressed: "12px",
    lead: "pl-4 pr-3",
    trail: "w-10 px-0",
    icon: 22,
  },
  md: {
    height: 56,
    inner: "4px",
    pressed: "12px",
    lead: "px-6",
    trail: "w-14 px-0",
    icon: 26,
  },
  lg: {
    height: 96,
    inner: "8px",
    pressed: "20px",
    lead: "px-12",
    trail: "w-24 px-0",
    icon: 38,
  },
  xl: {
    height: 136,
    inner: "12px",
    pressed: "20px",
    lead: "px-16",
    trail: "w-34 px-0",
    icon: 50,
  },
} as const

const splitButtonVariants = cva("inline-flex items-stretch gap-0.5")

type SplitButtonProps = React.ComponentProps<"div"> &
  VariantProps<typeof splitButtonVariants> & {
    variant?: ButtonProps["variant"]
    size?: keyof typeof splitSizes
    /** the leading action */
    onAction?: () => void
    /** the leading button's content */
    children: React.ReactNode
    /** whether the menu is open (drives the trailing button's shape) */
    open?: boolean
    /** props for the trailing button, e.g. a menu trigger's props */
    trailingProps?: Partial<ButtonProps>
    /** render the trailing button yourself, e.g. `<DropdownMenuTrigger render={…} />` */
    renderTrailing?: (button: React.ReactElement) => React.ReactElement
    trailingLabel?: string
  }

function SplitButton({
  className,
  variant = "default",
  size = "sm",
  onAction,
  children,
  open,
  trailingProps,
  renderTrailing,
  trailingLabel = "More options",
  style,
  ...props
}: SplitButtonProps) {
  const s = splitSizes[size]
  const buttonSize = size === "sm" ? "default" : size
  const trailing = (
    <Button
      variant={variant}
      size={buttonSize}
      aria-label={trailingLabel}
      data-open={open || undefined}
      className={cn(
        s.trail,
        "rounded-l-(--split-inner) rounded-r-(--btn-h2) data-press:rounded-l-(--split-pressed) data-press:rounded-r-(--btn-h2) data-open:rounded-(--btn-h2) data-open:data-press:rounded-(--btn-h2)"
      )}
      {...trailingProps}
    >
      <Icon
        name="keyboard_arrow_down"
        size={s.icon}
        className={cn(
          "transition-transform duration-(--md-sys-motion-spring-fast-spatial-duration) ease-spatial-fast",
          open && "rotate-180"
        )}
      />
    </Button>
  )
  return (
    <div
      data-slot="split-button"
      className={cn(splitButtonVariants(), className)}
      style={
        {
          "--split-inner": s.inner,
          "--split-pressed": s.pressed,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <Button
        variant={variant}
        size={buttonSize}
        onClick={onAction}
        className={cn(
          s.lead,
          "rounded-l-(--btn-h2) rounded-r-(--split-inner) data-press:rounded-l-(--btn-h2) data-press:rounded-r-(--split-pressed)"
        )}
      >
        {children}
      </Button>
      {renderTrailing ? renderTrailing(trailing) : trailing}
    </div>
  )
}

export { SplitButton }
