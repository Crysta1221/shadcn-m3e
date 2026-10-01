import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { LoadingAnimator, morphedShape } from "@/lib/m3e/shapes"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 Expressive loading indicator: seven Material shapes morphing into each
 * other on a spring while the whole shape rotates (Android's
 * LoadingIndicatorAnimatorDelegate). Tokens: 48dp container, 38dp indicator,
 * primary; `contained` sits on a primary-container disc.
 */
const loadingIndicatorVariants = cva(
  "relative inline-grid shrink-0 place-items-center rounded-full",
  {
    variants: {
      variant: {
        default: "text-primary",
        contained: "bg-primary-container text-on-primary-container",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

type LoadingIndicatorProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof loadingIndicatorVariants> & {
    /** container size in px (48 by default) */
    size?: number
  }

function toPath(points: [number, number][], r: number) {
  let d = ""
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i]
    d += `${i ? "L" : "M"}${(x * r).toFixed(2)} ${(y * r).toFixed(2)}`
  }
  return d + "Z"
}

function LoadingIndicator({
  className,
  variant,
  size = 48,
  style,
  ...props
}: LoadingIndicatorProps) {
  const pathRef = React.useRef<SVGPathElement>(null)
  const groupRef = React.useRef<SVGGElement>(null)

  React.useEffect(() => {
    const path = pathRef.current
    const group = groupRef.current
    if (!path || !group) return undefined
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    const animator = new LoadingAnimator()
    const draw = () => {
      path.setAttribute("d", toPath(morphedShape(animator.morph), 1))
      group.setAttribute("transform", `rotate(${animator.rotation})`)
    }
    if (reduced) {
      draw()
      return undefined
    }
    let frame = requestAnimationFrame(function tick(ts) {
      animator.update(ts)
      draw()
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  // 38dp of 48dp; the shapes are normalised to a radius of 1
  const r = (38 / 48) * 0.5

  return (
    <div
      role="progressbar"
      aria-label="Loading"
      data-slot="loading-indicator"
      className={cn(loadingIndicatorVariants({ variant }), className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <svg viewBox="-0.5 -0.5 1 1" width={size} height={size} aria-hidden>
        <g ref={groupRef}>
          <path
            ref={pathRef}
            fill="currentColor"
            transform={`scale(${variant === "contained" ? r * 0.84 : r})`}
          />
        </g>
      </svg>
    </div>
  )
}

export { LoadingIndicator, loadingIndicatorVariants }
