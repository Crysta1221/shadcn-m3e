import * as React from "react"

/** Compose ButtonGroupDefaults.ExpandedRatio */
const EXPANDED_RATIO = 0.15

/**
 * M3 Expressive standard button group: the pressed button grows by 15% of its
 * width and its neighbours give that room back (split between two neighbours
 * when the pressed one sits in the middle), on the fast spatial spring
 * (`transition-shape`). Mirrors Compose's ButtonGroup and matraic/m3e.
 *
 * Children are locked to their measured width so the change can animate; the
 * pressed state is the `data-press` attribute set by <Ripple>.
 */
export function useStandardGroup(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  React.useEffect(() => {
    const group = ref.current
    if (!group || !enabled) return undefined
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined

    const items = () =>
      [...group.children].filter(
        (el): el is HTMLElement => el instanceof HTMLElement
      )
    const widths = new Map<HTMLElement, number>()

    const measure = () => {
      if (items().some((el) => el.hasAttribute("data-press"))) return
      for (const el of items()) {
        el.style.width = ""
        el.style.flexShrink = ""
      }
      for (const el of items()) widths.set(el, el.getBoundingClientRect().width)
      for (const el of items()) {
        el.style.width = `${widths.get(el)}px`
        el.style.flexShrink = "0"
      }
    }

    const layout = () => {
      const list = items()
      const index = list.findIndex((el) => el.hasAttribute("data-press"))
      list.forEach((el, i) => {
        const w = widths.get(el)
        if (w === undefined) return
        let next = w
        if (index >= 0) {
          const pressedWidth = widths.get(list[index]) ?? 0
          let shrink = pressedWidth * EXPANDED_RATIO
          if (index > 0 && index < list.length - 1) shrink /= 2
          if (i === index) next = w + pressedWidth * EXPANDED_RATIO
          else if (Math.abs(i - index) === 1) next = w - shrink
        }
        el.style.width = `${next}px`
      })
    }

    measure()
    const resize = new ResizeObserver(() => measure())
    resize.observe(group)
    const mutations = new MutationObserver((records) => {
      if (records.some((r) => r.type === "childList")) {
        measure()
        return
      }
      layout()
    })
    mutations.observe(group, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-press"],
    })
    return () => {
      resize.disconnect()
      mutations.disconnect()
      for (const el of items()) {
        el.style.width = ""
        el.style.flexShrink = ""
      }
    }
  }, [ref, enabled])
}
