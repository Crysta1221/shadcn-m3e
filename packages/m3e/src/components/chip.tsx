import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { Icon } from "@/components/m3e/icon"
import { Ripple } from "@/components/m3e/ripple"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 chips (Compose AssistChip / FilterChip / InputChip / SuggestionChip
 * tokens): 32dp, small (8dp) corners, label large, 18dp icons.
 *   flat:     1dp outline-variant outline
 *   elevated: surface-container-low, elevation 1
 *   selected: secondary-container, no outline
 */
const chipVariants = cva(
  "group/chip state-layer relative inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-sm px-4 text-label-large whitespace-nowrap text-on-surface-variant focus-ring transition-shape outline-none select-none disabled:pointer-events-none disabled:opacity-38 has-data-[slot=chip-leading]:pl-2 has-data-[slot=chip-trailing]:pr-2 [&_[data-slot=chip-leading]]:text-primary [&>*:not([data-slot=ripple])]:relative",
  {
    variants: {
      variant: {
        flat: "border border-outline-variant",
        elevated: "bg-surface-container-low shadow-elevation-1",
      },
    },
    defaultVariants: { variant: "flat" },
  }
)

const SELECTED =
  "data-pressed:border-transparent data-pressed:bg-secondary-container data-pressed:text-on-secondary-container data-pressed:[&_[data-slot=chip-leading]]:text-on-secondary-container"

type ChipBaseProps = VariantProps<typeof chipVariants> & {
  /** leading icon (Material Symbols name or a node) */
  icon?: React.ReactNode
}

function leading(icon: React.ReactNode) {
  if (!icon) return null
  return (
    <span data-slot="chip-leading" className="inline-flex">
      {typeof icon === "string" ? <Icon name={icon} size={18} /> : icon}
    </span>
  )
}

/** Assist / suggestion chip: a small action. */
function Chip({
  className,
  variant,
  icon,
  children,
  ...props
}: ButtonPrimitive.Props & ChipBaseProps) {
  return (
    <ButtonPrimitive
      data-slot="chip"
      className={cn(chipVariants({ variant }), "text-on-surface", className)}
      {...props}
    >
      <Ripple />
      {leading(icon)}
      {children}
    </ButtonPrimitive>
  )
}

/** Filter chip: toggles; shows a check while selected. */
function FilterChip({
  className,
  variant,
  icon,
  children,
  ...props
}: TogglePrimitive.Props & ChipBaseProps) {
  return (
    <TogglePrimitive
      data-slot="filter-chip"
      className={cn(chipVariants({ variant }), SELECTED, "group", className)}
      {...props}
    >
      <Ripple />
      <span
        data-slot="chip-leading"
        className={cn(
          "inline-grid items-center transition-[grid-template-columns] duration-(--md-sys-motion-spring-fast-spatial-duration) ease-spatial-fast",
          icon
            ? "grid-cols-[1fr]"
            : "grid-cols-[0fr] group-data-pressed:grid-cols-[1fr]"
        )}
      >
        <span className="flex overflow-hidden">
          <span className="hidden group-data-pressed:flex">
            <Icon name="check" size={18} />
          </span>
          <span className="flex group-data-pressed:hidden">
            {typeof icon === "string" ? <Icon name={icon} size={18} /> : icon}
          </span>
        </span>
      </span>
      {children}
    </TogglePrimitive>
  )
}

/** Input chip: a piece of user input, with an optional remove button. */
function InputChip({
  className,
  variant,
  icon,
  children,
  onRemove,
  removeLabel = "Remove",
  ...props
}: React.ComponentProps<"span"> &
  ChipBaseProps & { onRemove?: () => void; removeLabel?: string }) {
  return (
    <span
      data-slot="input-chip"
      className={cn(
        chipVariants({ variant }),
        "cursor-default before:hidden",
        className
      )}
      {...props}
    >
      {leading(icon)}
      {children}
      {onRemove && (
        <button
          type="button"
          data-slot="chip-trailing"
          aria-label={removeLabel}
          onClick={onRemove}
          className="state-layer relative -mr-1 inline-grid size-6 cursor-pointer place-items-center rounded-full focus-ring"
        >
          <Icon name="close" size={18} />
        </button>
      )}
    </span>
  )
}

export { Chip, FilterChip, InputChip, chipVariants }
