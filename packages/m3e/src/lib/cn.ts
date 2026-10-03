/**
 * `cn` taught the M3 Expressive utilities, so it doesn't mistake
 * `text-label-large` (a font size) for a text color and drop `text-on-primary`.
 *
 * M3E components import it from here. Bare `import { cn } from "cn"` (what
 * `shadcn add` writes) is aliased to this module in vite.config.ts and
 * tsconfig, so components added later pick it up too.
 */
import { createCn } from "cn/config"

const TYPE_ROLES = ["display", "headline", "title", "body", "label"]
const TYPE_SIZES = ["large", "medium", "small"]
const typeScale = TYPE_ROLES.flatMap((r) =>
  TYPE_SIZES.flatMap((s) => [`${r}-${s}`, `${r}-${s}-emphasized`])
)

export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: typeScale }],
      shadow: [
        {
          shadow: [
            "elevation-0",
            "elevation-1",
            "elevation-2",
            "elevation-3",
            "elevation-4",
            "elevation-5",
          ],
        },
      ],
      "state-layer": ["state-layer", "state-layer-circle"],
      "state-layer-color": [{ "state-layer": [(v: string) => v !== "circle"] }],
      "ripple-color": [{ ripple: [() => true] }],
      motion: [
        {
          motion: [
            "spatial-fast",
            "spatial-default",
            "spatial-slow",
            "effects-fast",
            "effects-default",
            "effects-slow",
          ],
        },
      ],
    },
  },
})

// "cn/engine" is not aliased, so this does not import this module back
export { clsx, twJoin } from "cn/engine"
