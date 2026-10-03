import * as React from "react"

import { Shape, type ShapeName } from "@/components/m3e/shape"
import { cn } from "@/lib/utils"

const MORPHABLE: ShapeName[] = [
  "sunny",
  "soft-burst",
  "12-sided-cookie",
  "arch",
  "heart",
  "ghost-ish",
]

export const meta = {
  title: "Morphing",
  description:
    "Every polygon has the same point count, so changing name animates the clip-path on the slow effects spring. Pick a shape or click the big one to cycle.",
}

export default function Demo() {
  const [name, setName] = React.useState<ShapeName>("sunny")

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        aria-label="Next shape"
        className="rounded-md focus-ring"
        onClick={() =>
          setName(MORPHABLE[(MORPHABLE.indexOf(name) + 1) % MORPHABLE.length])
        }
      >
        <Shape name={name} className="size-40" />
      </button>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {MORPHABLE.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={s === name}
            aria-label={s}
            onClick={() => setName(s)}
            className="rounded-sm focus-ring"
          >
            <Shape
              name={s}
              className={cn(
                "size-10",
                s === name ? "bg-tertiary" : "bg-outline-variant"
              )}
            />
          </button>
        ))}
      </div>
      <p className="text-label-large text-on-surface-variant">{name}</p>
    </div>
  )
}
