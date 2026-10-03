import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/m3e/cn"

import { Ripple } from "@/components/m3e/ripple"
import { toggleVariants } from "@/components/m3e/toggle"
import { useStandardGroup } from "@/components/m3e/use-standard-group"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }
>({
  size: "default",
  variant: "default",
  spacing: 3,
  orientation: "horizontal",
})

/*
 * M3 Expressive button group.
 *  - spacing > 0: standard group (12dp gaps by default), items keep their own
 *    shapes; the pressed item grows by 15% and its neighbours make room
 *  - spacing = 0: connected group — 2px gaps, small inner corners, full outer
 *    corners, and the selected item turns fully round.
 */
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 3,
  orientation = "horizontal",
  children,
  ref,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }) {
  const groupRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref, () => groupRef.current!)
  useStandardGroup(groupRef, spacing > 0 && orientation === "horizontal")
  return (
    <ToggleGroupPrimitive
      ref={groupRef}
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      style={{ "--gap": spacing }}
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-[spacing=0]:gap-0.5 data-vertical:flex-col data-vertical:items-stretch",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "focus-visible:z-10",
        // connected: inner corners small, outer corners full, selected = full
        "group-data-[spacing=0]/toggle-group:grow group-data-[spacing=0]/toggle-group:[--btn-r-pressed:var(--radius-xs)] group-data-[spacing=0]/toggle-group:[--btn-r-selected:var(--btn-h2)] group-data-[spacing=0]/toggle-group:[--btn-r:var(--radius-sm)]",
        "group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-(--btn-h2) group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-(--btn-h2)",
        "group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-(--btn-h2) group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-(--btn-h2)",
        // connected groups default to M3E filled toggles: surface-container → primary
        "group-data-[spacing=0]/toggle-group:data-[variant=default]:bg-surface-container group-data-[spacing=0]/toggle-group:data-[variant=default]:data-pressed:bg-primary group-data-[spacing=0]/toggle-group:data-[variant=default]:data-pressed:text-on-primary",
        className
      )}
      {...props}
    >
      <Ripple />
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
