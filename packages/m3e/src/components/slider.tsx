"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 Expressive slider: a 16dp track split around a 4×44dp bar handle, with a
 * 6dp gap either side of the handle and a stop indicator at the end.
 *
 * The indicator element spans the active range; its children draw the active
 * segment (inset by the gap) and the inactive segments beyond it, and the
 * rounded track clips them.
 *
 * The handle is inset so it stays inside the track at both ends, and the stop
 * indicator is hidden once the handle reaches the end it would sit beside.
 */
const GAP = "8px" // 6dp gap + half of the 4dp handle

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  onValueChange,
  ...props
}: SliderPrimitive.Root.Props) {
  const [internal, setInternal] = React.useState(defaultValue)
  const current = value ?? internal
  const last = Array.isArray(current) ? current[current.length - 1] : current
  const atMax = last !== undefined && last >= max
  const count = Array.isArray(current) ? current.length : 1
  const range = count > 1

  return (
    <SliderPrimitive.Root
      className={cn(
        "group/slider data-horizontal:w-full data-vertical:h-full",
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      onValueChange={(next, details) => {
        setInternal(next)
        onValueChange?.(next, details)
      }}
      // custom properties: React's CSSProperties has no `--*` keys
      // oxlint-disable-next-line no-unsafe-type-assertion
      style={{ "--slider-gap": GAP } as React.CSSProperties}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex touch-none items-center select-none data-horizontal:h-11 data-horizontal:w-full data-vertical:h-full data-vertical:min-h-40 data-vertical:w-11 data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full select-none data-horizontal:h-4 data-horizontal:w-full data-vertical:h-full data-vertical:w-4"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="select-none data-horizontal:h-full data-vertical:w-full"
          >
            {/* active */}
            <span
              className={cn(
                "absolute rounded-xs bg-primary group-data-disabled/slider:bg-on-surface/38",
                "group-data-horizontal/slider:inset-y-0 group-data-horizontal/slider:right-(--slider-gap) group-data-horizontal/slider:left-0",
                "group-data-vertical/slider:inset-x-0 group-data-vertical/slider:top-(--slider-gap) group-data-vertical/slider:bottom-0",
                range &&
                  "group-data-horizontal/slider:left-(--slider-gap) group-data-vertical/slider:bottom-(--slider-gap)"
              )}
            />
            {/* inactive, after the (last) handle */}
            <span
              className={cn(
                "absolute rounded-xs bg-secondary-container group-data-disabled/slider:bg-on-surface/12",
                "group-data-horizontal/slider:inset-y-0 group-data-horizontal/slider:left-[calc(100%+var(--slider-gap))] group-data-horizontal/slider:w-[200vw]",
                "group-data-vertical/slider:inset-x-0 group-data-vertical/slider:bottom-[calc(100%+var(--slider-gap))] group-data-vertical/slider:h-[200vh]"
              )}
            />
            {/* inactive, before the first handle of a range */}
            {range && (
              <span
                className={cn(
                  "absolute rounded-xs bg-secondary-container group-data-disabled/slider:bg-on-surface/12",
                  "group-data-horizontal/slider:inset-y-0 group-data-horizontal/slider:right-[calc(100%+var(--slider-gap))] group-data-horizontal/slider:w-[200vw]",
                  "group-data-vertical/slider:inset-x-0 group-data-vertical/slider:top-[calc(100%+var(--slider-gap))] group-data-vertical/slider:h-[200vh]"
                )}
              />
            )}
          </SliderPrimitive.Indicator>
          {/* stop indicator */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute size-1 rounded-full bg-primary group-data-disabled/slider:bg-on-surface/38 group-data-horizontal/slider:top-1/2 group-data-horizontal/slider:right-1.5 group-data-horizontal/slider:-translate-y-1/2 group-data-vertical/slider:top-1.5 group-data-vertical/slider:left-1/2 group-data-vertical/slider:-translate-x-1/2",
              atMax && "hidden"
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: count }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="z-1 block shrink-0 cursor-grab rounded-full bg-primary transition-[width,height] duration-(--md-sys-motion-spring-fast-spatial-duration) ease-spatial-fast select-none group-data-horizontal/slider:h-11 group-data-horizontal/slider:w-1 group-data-vertical/slider:h-1 group-data-vertical/slider:w-11 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary active:cursor-grabbing group-data-horizontal/slider:active:w-0.5 group-data-vertical/slider:active:h-0.5 data-disabled:bg-on-surface/38"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
