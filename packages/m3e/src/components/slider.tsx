"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cn } from "@/lib/m3e/cn"
import { usePortalContainer } from "@/components/m3e/portal-container"

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

type SliderProps = SliderPrimitive.Root.Props & {
  showValueLabel?: boolean
  getAriaLabel?: SliderPrimitive.Thumb.Props["getAriaLabel"]
  getAriaValueText?: SliderPrimitive.Thumb.Props["getAriaValueText"]
}

function Slider({
  className,
  style,
  defaultValue,
  value,
  min = 0,
  max = 100,
  showValueLabel = false,
  getAriaLabel,
  getAriaValueText,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={(state) =>
        cn(
          "group/slider data-horizontal:w-full data-vertical:h-full",
          typeof className === "function" ? className(state) : className
        )
      }
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      // Keep the track gap when a consumer supplies layout styles.
      style={(state) =>
        ({
          "--slider-gap": GAP,
          ...(typeof style === "function" ? style(state) : style),
        }) as React.CSSProperties
      }
      {...props}
    >
      <SliderPrimitive.Value
        render={(_valueProps, state) => (
          <SliderContents
            state={state}
            showValueLabel={showValueLabel}
            getAriaLabel={getAriaLabel}
            getAriaValueText={getAriaValueText}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
          />
        )}
      />
    </SliderPrimitive.Root>
  )
}

function SliderContents({
  state,
  showValueLabel,
  ...thumbProps
}: {
  state: SliderPrimitive.Root.State
} & Pick<
  SliderProps,
  | "showValueLabel"
  | "getAriaLabel"
  | "getAriaValueText"
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
>) {
  const [interaction, setInteraction] = React.useState(0)
  const count = state.values.length
  const range = count > 1
  const atMax = state.values[count - 1] >= state.max
  return (
    <SliderPrimitive.Control
      onPointerDownCapture={() => setInteraction((previous) => previous + 1)}
      className="relative flex touch-none items-center select-none data-horizontal:h-11 data-horizontal:w-full data-vertical:h-full data-vertical:min-h-40 data-vertical:w-11 data-vertical:flex-col"
    >
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
              "group-data-horizontal/slider:inset-y-0 group-data-horizontal/slider:inset-s-0 group-data-horizontal/slider:inset-e-(--slider-gap)",
              "group-data-vertical/slider:inset-x-0 group-data-vertical/slider:top-(--slider-gap) group-data-vertical/slider:bottom-0",
              range &&
                "group-data-horizontal/slider:inset-s-(--slider-gap) group-data-vertical/slider:bottom-(--slider-gap)"
            )}
          />
          {/* inactive, after the (last) handle */}
          <span
            className={cn(
              "absolute rounded-xs bg-secondary-container group-data-disabled/slider:bg-on-surface/12",
              "group-data-horizontal/slider:inset-y-0 group-data-horizontal/slider:inset-s-[calc(100%+var(--slider-gap))] group-data-horizontal/slider:w-[200vw]",
              "group-data-vertical/slider:inset-x-0 group-data-vertical/slider:bottom-[calc(100%+var(--slider-gap))] group-data-vertical/slider:h-[200vh]"
            )}
          />
          {/* inactive, before the first handle of a range */}
          {range && (
            <span
              className={cn(
                "absolute rounded-xs bg-secondary-container group-data-disabled/slider:bg-on-surface/12",
                "group-data-horizontal/slider:inset-y-0 group-data-horizontal/slider:inset-e-[calc(100%+var(--slider-gap))] group-data-horizontal/slider:w-[200vw]",
                "group-data-vertical/slider:inset-x-0 group-data-vertical/slider:top-[calc(100%+var(--slider-gap))] group-data-vertical/slider:h-[200vh]"
              )}
            />
          )}
        </SliderPrimitive.Indicator>
        {/* stop indicator */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute size-1 rounded-full bg-primary group-data-disabled/slider:bg-on-surface/38 group-data-horizontal/slider:inset-e-1.5 group-data-horizontal/slider:top-1/2 group-data-horizontal/slider:-translate-y-1/2 group-data-vertical/slider:top-1.5 group-data-vertical/slider:left-1/2 group-data-vertical/slider:-translate-x-1/2",
            atMax && "hidden"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: count }, (_, index) => (
        <SliderThumb
          key={index}
          index={index}
          interaction={interaction}
          state={state}
          showValueLabel={showValueLabel}
          {...thumbProps}
        />
      ))}
    </SliderPrimitive.Control>
  )
}

function SliderThumb({
  state,
  showValueLabel,
  index,
  interaction,
  ...props
}: {
  state: SliderPrimitive.Root.State
  showValueLabel?: boolean
  index: number
  interaction: number
} & SliderPrimitive.Thumb.Props) {
  const [anchor, setAnchor] = React.useState<HTMLDivElement | null>(null)
  const container = usePortalContainer()
  const [focused, setFocused] = React.useState(false)
  const [keyboardInteraction, setKeyboardInteraction] = React.useState<
    number | null
  >(null)
  const [dismissed, setDismissed] = React.useState<number | null>(null)
  // Base UI clears activeThumbIndex on release while the input keeps focus.
  // A second drag of that input does not emit another focus event.
  const active = state.dragging && focused
  const open =
    !!showValueLabel &&
    !state.disabled &&
    dismissed !== interaction &&
    (keyboardInteraction === interaction || active)

  return (
    <>
      <SliderPrimitive.Thumb
        ref={setAnchor}
        index={index}
        data-slot="slider-thumb"
        onFocus={(event) => {
          setFocused(true)
          setKeyboardInteraction(
            event.currentTarget.matches(":focus-visible") ? interaction : null
          )
          setDismissed(null)
        }}
        onBlur={() => {
          setFocused(false)
          setKeyboardInteraction(null)
          setDismissed(null)
        }}
        onPointerDown={() => setDismissed(null)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            if (open) {
              event.preventDefault()
              event.stopPropagation()
            }
            setDismissed(interaction)
          } else {
            setKeyboardInteraction(interaction)
            setDismissed(null)
          }
        }}
        className="z-1 block shrink-0 cursor-grab rounded-full bg-primary transition-[width,height] motion-spatial-fast select-none group-data-dragging/slider:cursor-grabbing group-data-horizontal/slider:h-11 group-data-horizontal/slider:w-1 group-data-vertical/slider:h-1 group-data-vertical/slider:w-11 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-secondary group-data-horizontal/slider:data-dragging:w-0.5 group-data-vertical/slider:data-dragging:h-0.5 data-disabled:bg-on-surface/38"
        {...props}
      />
      {showValueLabel && (
        <TooltipPrimitive.Root open={open}>
          <TooltipPrimitive.Portal
            container={
              container === undefined
                ? (anchor?.closest<HTMLElement>('[data-slot="theme-scope"]') ??
                  undefined)
                : container
            }
          >
            <TooltipPrimitive.Positioner
              anchor={anchor}
              side={state.orientation === "vertical" ? "inline-start" : "top"}
              sideOffset={12}
              collisionBoundary={container ?? undefined}
              className="pointer-events-none z-50"
            >
              {/* Compose SliderTokens: inverse roles, label-large and a 12dp gap.
                  matraic/m3e supplies the 48×44dp full-rounded value bubble. */}
              <TooltipPrimitive.Popup
                aria-hidden
                role="presentation"
                data-slot="slider-value-label"
                className="flex min-h-11 min-w-12 items-center justify-center rounded-full bg-inverse-surface px-3 text-label-large text-inverse-on-surface transition-[opacity,transform] motion-spatial-fast data-ending-style:scale-50 data-ending-style:opacity-0 data-starting-style:scale-50 data-starting-style:opacity-0"
              >
                <SliderPrimitive.Value render={<span aria-hidden />}>
                  {(formatted) => formatted[index]}
                </SliderPrimitive.Value>
              </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      )}
    </>
  )
}

export { Slider, type SliderProps }
