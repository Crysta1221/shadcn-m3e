import * as React from "react"

import { cn } from "@/lib/m3e/cn"

/*
 * M3 Expressive circular progress indicator, ported from matraic/m3e
 * (CircularProgressIndicatorElement, MIT) with Compose
 * CircularProgressIndicator tokens:
 *   flat — 40dp, 4dp stroke; indeterminate is the classic two-half spinner
 *   wavy — 48dp, amplitude 1.6dp, wavelength 15dp. Determinate: a full-circle
 *          wave, masked by the active arc and slowly counter-rotating.
 *          Indeterminate: the wavy arc holds, grows, holds and shrinks while
 *          spinning, with the rest of the track shown.
 * The active and track arcs are separated by a gap of one stroke width.
 */
const STROKE = 4
const AMPLITUDE = 1.6
const WAVELENGTH = 15
const WAVY_INDETERMINATE_DURATION = 1575

type Geometry = { diameter: number; stroke: number; amplitude: number }

function circle(g: Geometry, padding = g.amplitude) {
  const pad = padding + g.stroke / 2
  const r = g.diameter / 2
  return { cx: r + pad, cy: r + pad, r, pad }
}

const sizeToDegrees = (g: Geometry, size: number, padding = g.amplitude) =>
  size * (360 / (2 * Math.PI * circle(g, padding).r))

const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180

function viewBox(g: Geometry) {
  const c = circle(g)
  return `0 0 ${g.diameter + c.pad * 2} ${g.diameter + c.pad * 2}`
}

function arc(g: Geometry, { start = 0, end = 360, gap = 0 } = {}) {
  const c = circle(g)
  if (gap > 0) {
    start += sizeToDegrees(g, gap)
    end -= sizeToDegrees(g, gap)
  }
  if (end - start >= 360) end = start + 359.999
  const p = (deg: number) => ({
    x: c.cx + c.r * Math.cos(toRad(deg)),
    y: c.cy + c.r * Math.sin(toRad(deg)),
  })
  const a = p(end)
  const b = p(start)
  return `M ${a.x} ${a.y} A ${c.r} ${c.r} 0 ${end - start <= 180 ? 0 : 1} 0 ${b.x} ${b.y}`
}

function wavyArc(
  g: Geometry,
  { start = 0, end = 360, amplitude = g.amplitude, steps = 200 } = {}
) {
  const c = circle(g)
  const startRad = toRad(start)
  let endRad = toRad(end)
  if (start === end) endRad = startRad
  else if (endRad < startRad) endRad += Math.PI * 2
  const total = endRad - startRad
  const waveCount = (2 * Math.PI * c.r) / WAVELENGTH
  const phase = (Math.PI / 2) * (waveCount - 1)
  let d = ""
  for (let i = 0; i <= steps; i++) {
    const angle = startRad + (i / steps) * total
    const radius = c.r - amplitude * Math.sin(angle * waveCount + phase)
    d += `${i ? "L" : "M"} ${radius * Math.cos(angle) + c.cx},${radius * Math.sin(angle) + c.cy} `
  }
  return d
}

const smoothstep = (p: number) => p * p * (3 - 2 * p)

/** hold min → grow → hold max → shrink, smoothstep between */
function wavySweep(g: Geometry, t: number) {
  const pad = sizeToDegrees(g, g.stroke) * 2
  const min = 18 + pad
  const max = 280 - pad
  const d = WAVY_INDETERMINATE_DURATION
  const u = t % (d * 4)
  if (u < d) return min
  if (u < d * 2) return min + (max - min) * smoothstep((u - d) / d)
  if (u < d * 3) return max
  return max - (max - min) * smoothstep((u - d * 3) / d)
}

type CircularProgressProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** null = indeterminate */
  value?: number | null
  max?: number
  variant?: "flat" | "wavy"
  /** diameter in px (40 flat / 48 wavy) */
  size?: number
  children?: React.ReactNode
}

function CircularProgress({
  className,
  value = null,
  max = 100,
  variant = "flat",
  size,
  children,
  style,
  ...props
}: CircularProgressProps) {
  const wavy = variant === "wavy"
  const diameter = size ?? (wavy ? 48 : 40)
  const g: Geometry = {
    diameter,
    stroke: STROKE,
    amplitude: wavy ? AMPLITUDE : 0,
  }
  const indeterminate = value == null
  const maskId = React.useId()
  const activeRef = React.useRef<SVGPathElement>(null)
  const trackRef = React.useRef<SVGPathElement>(null)

  // wavy indeterminate: sweep driven per frame
  React.useEffect(() => {
    if (!(wavy && indeterminate)) return undefined
    let frame = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const sweep = wavySweep(g, now - t0)
      activeRef.current?.setAttribute("d", wavyArc(g, { end: sweep }))
      trackRef.current?.setAttribute(
        "d",
        arc(g, { start: sweep, gap: g.stroke })
      )
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // geometry only depends on these
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wavy, indeterminate, diameter])

  const minDegrees = sizeToDegrees(g, g.stroke * 2)
  let degrees = indeterminate
    ? 0
    : (Math.min(max, Math.max(0, value)) / max) * 360
  if (degrees > 0) degrees = Math.max(minDegrees, degrees)
  const amplitude =
    !wavy || degrees <= minDegrees * 1.5 || degrees === 360 ? 0 : AMPLITUDE
  const activeArc = arc(g, { end: degrees, gap: degrees < 360 ? g.stroke : 0 })
  const trackArc = arc(g, { start: degrees, gap: degrees > 0 ? g.stroke : 0 })
  const vb = viewBox(g)
  const c = circle(g)

  let body: React.ReactNode
  if (indeterminate && !wavy) {
    // Material's two-half spinner
    const half = (start: number, end: number) => (
      <svg viewBox={vb} className="m3-cp-circle absolute inset-0 size-full">
        <path
          d={arc(g, { start, end })}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
      </svg>
    )
    body = (
      <div className="m3-cp-rotate absolute inset-0">
        <div className="m3-cp-spinner absolute inset-0">
          <div className="m3-cp-left absolute inset-y-0 right-1/2 left-0 overflow-hidden">
            {half(-45, 90 + STROKE)}
          </div>
          <div className="m3-cp-right absolute inset-y-0 right-0 left-1/2 overflow-hidden">
            {half(-STROKE, 135)}
          </div>
        </div>
      </div>
    )
  } else if (indeterminate) {
    body = (
      <svg viewBox={vb} className="m3-cp-wavy-spin absolute inset-0 size-full">
        <path
          ref={activeRef}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          ref={trackRef}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          className="stroke-secondary-container"
        />
      </svg>
    )
  } else {
    const pad = amplitude > 0 ? amplitude + STROKE / 2 : STROKE
    body = (
      <svg viewBox={vb} className="absolute inset-0 size-full">
        {degrees > 0 && amplitude > 0 && (
          <defs>
            <mask id={maskId}>
              <path
                d={activeArc}
                stroke="white"
                strokeWidth={STROKE + pad}
                fill="none"
                strokeLinecap="round"
              />
            </mask>
          </defs>
        )}
        {degrees > 0 &&
          (amplitude > 0 ? (
            <g mask={`url(#${CSS.escape(maskId)})`}>
              <path
                d={wavyArc(g, { amplitude })}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="m3-cp-wave"
                style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
              />
            </g>
          ) : (
            <path
              d={activeArc}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          ))}
        {360 - degrees >= minDegrees && (
          <path
            d={trackArc}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            className="stroke-secondary-container"
          />
        )}
      </svg>
    )
  }

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      data-slot="circular-progress"
      data-variant={variant}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center align-middle text-primary",
        className
      )}
      style={{ width: diameter, height: diameter, ...style }}
      {...props}
    >
      {body}
      {children && (
        <div className="relative flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

export { CircularProgress }
