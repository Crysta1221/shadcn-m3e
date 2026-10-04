import * as React from "react"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 Expressive carousel (m3.material.io/components/carousel).
 *
 *   multi-browse — large items, then a medium and a small one that hint at
 *                  what is next; items resize continuously while scrolling
 *   hero         — one large item with small items beside it
 *   uncontained  — fixed-width items that scroll to the edge
 *   full-screen  — one item fills the width and the rest snap past it
 *
 * Items are 28dp-cornered (extra large) with 8dp between; small items are
 * 40–56dp wide. Multi-browse and hero draw their items from the scroll
 * position: a native scroll container (so touch, wheel, keys and snapping all
 * work) drives a sticky layer whose items are laid out per frame. Item content
 * keeps its large size and is masked by the shrinking item, like Compose's
 * carousel.
 */
type Variant = "multi-browse" | "hero" | "uncontained" | "full-screen"

const SMALL = 56
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** width of the item `d` steps ahead of the scroll position */
function widthAt(
  d: number,
  {
    large,
    medium,
    small,
    big,
  }: { large: number; medium: number; small: number; big: number }
) {
  if (d <= -2) return 0
  if (d < -1) return lerp(0, small, d + 2)
  if (d < 0) return lerp(small, large, d + 1)
  if (d < big - 1) return large
  if (d < big) return lerp(large, medium, d - (big - 1))
  if (d < big + 1) return lerp(medium, small, d - big)
  if (d < big + 2) return lerp(small, 0, d - (big + 1))
  return 0
}

type CarouselProps = React.ComponentProps<"div"> & {
  variant?: Variant
  /** preferred width of a large item, in px */
  itemWidth?: number
  height?: number
  gap?: number
}

function ExpressiveCarousel({
  variant = "multi-browse",
  itemWidth = 186,
  height = 221,
  gap = 8,
  className,
  children,
  ...props
}: CarouselProps) {
  const items = React.Children.toArray(children)
  const count = items.length
  const rootRef = React.useRef<HTMLDivElement>(null)
  const nodes = React.useRef<(HTMLDivElement | null)[]>([])
  const [width, setWidth] = React.useState(0)

  React.useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return undefined
    const ro = new ResizeObserver(([e]) =>
      setWidth(Math.round(e.contentRect.width))
    )
    ro.observe(el)
    setWidth(Math.round(el.getBoundingClientRect().width))
    return () => ro.disconnect()
  }, [])

  // keylines
  const geo = React.useMemo(() => {
    if (variant === "uncontained" || width === 0) return null
    if (variant === "hero") {
      const large = Math.max(SMALL, width - SMALL - gap)
      return { big: 1, large, medium: SMALL, small: SMALL }
    }
    const big = Math.max(
      1,
      Math.floor((width - 1.5 * SMALL - gap) / (itemWidth + gap))
    )
    const large = (width - 1.5 * SMALL - (big + 1) * gap) / (big + 0.5)
    return { big, large, medium: (large + SMALL) / 2, small: SMALL }
  }, [variant, width, itemWidth, gap])

  const step = geo ? geo.large + gap : itemWidth + gap
  const maxIndex = geo
    ? Math.max(0, count - geo.big - (variant === "hero" ? 1 : 2))
    : 0

  const layout = React.useCallback(
    (scrollLeft: number) => {
      if (!geo) return
      const s = step ? scrollLeft / step : 0
      let x = 0
      for (let i = 0; i < count; i++) {
        const node = nodes.current[i]
        if (!node) continue
        const w = widthAt(i - s, geo)
        node.style.width = `${w}px`
        node.style.transform = `translateX(${x}px)`
        node.style.visibility = w < 1 ? "hidden" : "visible"
        node.dataset.size =
          w >= geo.large - 1 ? "large" : w > geo.small + 1 ? "medium" : "small"
        if (w >= 1) x += w + gap
      }
    },
    [geo, step, count, gap]
  )

  const scrollerRef = React.useRef<HTMLDivElement>(null)
  React.useLayoutEffect(() => {
    layout(scrollerRef.current?.scrollLeft ?? 0)
  }, [layout])

  if (variant === "uncontained" || variant === "full-screen") {
    // full-screen items take the whole track width; before the first
    // measurement 100% already puts them there
    const slide = variant === "full-screen" ? (width ?? 0) || "100%" : itemWidth
    return (
      <div
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        data-variant={variant}
        ref={rootRef}
        className={cn("relative w-full", className)}
        {...props}
      >
        <div
          role="group"
          aria-label="Carousel items"
          tabIndex={0}
          className="flex snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain scroll-smooth focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary [&::-webkit-scrollbar]:hidden"
          style={{ gap, height }}
        >
          {items.map((child, i) => (
            <div
              key={i}
              data-slot="carousel-item"
              className="shrink-0 snap-start overflow-hidden rounded-2xl"
              style={{ width: slide }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      data-slot="carousel"
      data-variant={variant}
      ref={rootRef}
      className={cn("relative w-full", className)}
      {...props}
    >
      <div
        ref={scrollerRef}
        role="group"
        aria-label="Carousel items"
        tabIndex={0}
        onScroll={(e) => layout(e.currentTarget.scrollLeft)}
        onKeyDown={(e) => {
          const el = e.currentTarget
          if (e.key === "ArrowRight")
            el.scrollBy({ left: step, behavior: "smooth" })
          else if (e.key === "ArrowLeft")
            el.scrollBy({ left: -step, behavior: "smooth" })
          else return
          e.preventDefault()
        }}
        className="grid snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary [&::-webkit-scrollbar]:hidden"
        style={{ height }}
      >
        {/* scroll range and snap points: one per step */}
        <div
          aria-hidden
          className="relative [grid-area:1/1]"
          style={{ width: width + maxIndex * step, height: 1 }}
        >
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <span
              key={i}
              className="absolute top-0 size-px snap-start"
              style={{ left: i * step }}
            />
          ))}
        </div>
        {/* the items stay put while the scroller moves under them */}
        <div
          className="sticky left-0 [grid-area:1/1]"
          style={{ width, height }}
        >
          {items.map((child, i) => (
            <div
              key={i}
              ref={(n) => {
                nodes.current[i] = n
              }}
              data-slot="carousel-item"
              className="absolute top-0 left-0 overflow-hidden rounded-2xl"
              style={{ height }}
            >
              <div
                className="absolute top-0 left-1/2 h-full -translate-x-1/2"
                style={{ width: geo ? geo.large : itemWidth }}
              >
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** a filled slide: any content works, this adds the standard container */
function CarouselSlide({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="carousel-slide"
      className={cn(
        "flex size-full flex-col justify-end bg-surface-container-highest p-4 text-on-surface",
        className
      )}
      {...props}
    />
  )
}

export { ExpressiveCarousel, CarouselSlide }
