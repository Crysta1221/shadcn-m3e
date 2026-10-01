"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 Expressive linear progress indicator (Compose LinearProgressIndicator
 * tokens, rendering after matraic/m3e):
 *   flat  — 4dp active track, 4dp gap, secondary-container track, 4dp stop
 *   wavy  — the active track is a travelling sine wave (amplitude 3dp,
 *           wavelength 40dp; 20dp while indeterminate)
 * `value={null}` is indeterminate: two bars chase each other.
 */
const THICKNESS = 4
const AMPLITUDE = 3
const WAVELENGTH = 40
const INDETERMINATE_WAVELENGTH = 20

type Variant = "flat" | "wavy"

/** a sine wave of quadratic segments, starting at x = 0 */
export function wavePath(
  width: number,
  wavelength: number,
  amplitude: number,
  stroke: number
) {
  const a = amplitude
  const y = a + stroke / 2
  const step = wavelength / 2
  let d = `M 0,${y}`
  for (let x = 0; x <= width + wavelength; x += step) {
    const cx = x + step / 2
    const cy = y + a * Math.sin((2 * Math.PI * cx) / wavelength) * 2
    d += ` Q ${cx},${cy} ${x + step},${y}`
  }
  return d
}

function useWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = React.useState(0)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const ro = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return width
}

function Progress({
  className,
  children,
  value,
  max = 100,
  variant = "flat",
  ...props
}: ProgressPrimitive.Root.Props & { variant?: Variant }) {
  return (
    <ProgressPrimitive.Root
      value={value}
      max={max}
      data-slot="progress"
      data-variant={variant}
      className={cn("group/progress flex flex-wrap gap-x-3 gap-y-2", className)}
      {...props}
    >
      {children}
      <ProgressTrack variant={variant} value={value} max={max} />
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({
  className,
  variant = "flat",
  value,
  max = 100,
  ...props
}: ProgressPrimitive.Track.Props & {
  variant?: Variant
  value?: number | null
  max?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const width = useWidth(ref)
  const wavy = variant === "wavy"
  const height = wavy ? THICKNESS + AMPLITUDE * 2 : THICKNESS
  const indeterminate = value == null
  const fraction = indeterminate ? 0 : Math.min(1, Math.max(0, value / max))
  const maskId = React.useId()

  return (
    <ProgressPrimitive.Track
      ref={ref}
      data-slot="progress-track"
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height }}
      {...props}
    >
      {indeterminate ? (
        wavy ? (
          <svg width={width} height={height} className="block" aria-hidden>
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse">
                <rect
                  className="m3-progress-bar-1"
                  height={height}
                  fill="white"
                />
                <rect
                  className="m3-progress-bar-2"
                  height={height}
                  fill="white"
                />
              </mask>
            </defs>
            <rect
              y={(height - THICKNESS) / 2}
              width={width}
              height={THICKNESS}
              rx={THICKNESS / 2}
              className="fill-secondary-container"
            />
            <path
              d={wavePath(
                width,
                INDETERMINATE_WAVELENGTH,
                AMPLITUDE,
                THICKNESS
              )}
              mask={`url(#${CSS.escape(maskId)})`}
              className="fill-none stroke-primary"
              strokeWidth={THICKNESS}
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <div className="relative size-full rounded-full bg-secondary-container">
            <div className="m3-progress-bar-1 absolute inset-y-0 rounded-full bg-primary" />
            <div className="m3-progress-bar-2 absolute inset-y-0 rounded-full bg-primary" />
          </div>
        )
      ) : (
        <div className="flex size-full items-center">
          {fraction > 0 && (
            <div
              className="relative h-full shrink-0 overflow-hidden rounded-full transition-[width] duration-(--md-sys-motion-spring-default-effects-duration) ease-effects-default"
              style={{ width: `${fraction * 100}%` }}
            >
              {wavy && fraction < 1 ? (
                <svg
                  width={fraction * width + WAVELENGTH * 3}
                  height={height}
                  className="absolute top-0 left-0 block animate-[m3-wave-slide_1.5s_linear_infinite]"
                  aria-hidden
                >
                  <path
                    d={wavePath(
                      fraction * width + WAVELENGTH * 2,
                      WAVELENGTH,
                      AMPLITUDE,
                      THICKNESS
                    )}
                    className="fill-none stroke-primary"
                    strokeWidth={THICKNESS}
                    strokeLinecap="round"
                    transform={`translate(${THICKNESS / 2} 0)`}
                  />
                </svg>
              ) : (
                <div
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full bg-primary"
                  style={{ height: THICKNESS }}
                />
              )}
            </div>
          )}
          {fraction < 1 && (
            <>
              {fraction > 0 && <div className="shrink basis-1" />}
              <div
                className="min-w-0 flex-1 rounded-full bg-secondary-container"
                style={{ height: THICKNESS }}
              />
              <div className="shrink basis-1" />
              <div
                className="shrink-0 rounded-full bg-primary"
                style={{ width: THICKNESS, height: THICKNESS }}
              />
            </>
          )}
        </div>
      )}
    </ProgressPrimitive.Track>
  )
}

/** kept for API compatibility with shadcn; the track draws everything */
function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("hidden", className)}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-label-large text-on-surface", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ml-auto text-label-large text-on-surface-variant tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
