import * as React from "react"

import { cn } from "@/lib/m3e/cn"
import { shapeClipPath, type ShapeName } from "@/lib/m3e/shape-library"

/*
 * Port of m3e-shape: clips its box (and children) to a Material shape-library
 * shape. Every polygon has the same point count, so changing `name` morphs on
 * the slow effects spring. img/video children fill the shape (object-cover).
 * Decorative by default: no ARIA role.
 */
type ShapeProps = React.ComponentProps<"div"> & {
  name?: ShapeName
}

function Shape({ name, className, style, ...props }: ShapeProps) {
  return (
    <div
      data-slot="shape"
      className={cn(
        "relative inline-block aspect-square size-12 shrink-0 bg-primary transition-[clip-path] motion-effects-slow will-change-[clip-path]",
        "[&>img]:absolute [&>img]:inset-0 [&>img]:size-full [&>img]:object-cover",
        "[&>video]:absolute [&>video]:inset-0 [&>video]:size-full [&>video]:object-cover",
        className
      )}
      style={{ clipPath: name ? shapeClipPath(name) : undefined, ...style }}
      {...props}
    />
  )
}

export { Shape, type ShapeName, type ShapeProps }
export { SHAPE_NAMES } from "@/lib/m3e/shape-library"
