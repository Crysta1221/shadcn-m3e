import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import type { ReactElement } from "react"

import appIcons from "../../../packages/m3e/src/components/icon-data.app"
import coreIcons from "../../../packages/m3e/src/components/icon-data"

/**
 * What the preview cards (card.ts) and the update card (update.ts) share: the
 * M3 baseline colors of og.html, the logo, satori node helpers, the lobed
 * shapes and the bundled glyphs. Nothing here may import the docs' own code,
 * so update.ts runs as a plain script.
 */
export const PRIMARY = "#6750a4"
export const PRIMARY_CONTAINER = "#eaddff"
export const SECONDARY_CONTAINER = "#e8def8"
export const ON_SECONDARY_CONTAINER = "#1d192b"
export const TERTIARY_CONTAINER = "#ffd8e4"
export const ON_TERTIARY_CONTAINER = "#31111d"
export const ON_PRIMARY_CONTAINER = "#21005d"
export const ON_SURFACE = "#1d1b20"
export const ON_SURFACE_VARIANT = "#49454f"
export const BACKGROUND =
  "linear-gradient(135deg, #faf3ff, #fef7ff 55%, #fdf0f6)"

// the favicon, as in og.html
export const LOGO =
  "M89.4282 11.7931C116.492 0.0387955 143.961 27.5077 132.207 54.5718L130.263 59.0465C126.675 67.3094 126.675 76.6907 130.263 84.9535L132.207 89.4282C143.961 116.492 116.492 143.961 89.4282 132.207L84.9535 130.263C76.6907 126.675 67.3093 126.675 59.0465 130.263L54.5718 132.207C27.5077 143.961 0.0387983 116.492 11.7931 89.4282L13.7366 84.9535C17.3253 76.6907 17.3252 67.3093 13.7366 59.0465L11.7931 54.5718C0.0387955 27.5077 27.5077 0.0387993 54.5718 11.7931L59.0465 13.7366C67.3094 17.3252 76.6907 17.3252 84.9535 13.7366L89.4282 11.7931Z"

export type Node = ReactElement

export const h = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
  props: Record<string, unknown> = {}
): Node => ({ type, props: { style, children, ...props }, key: null })

export const dataUri = (svg: string) =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`

/** a smooth n-lobed outline, the family of M3E shapes (cookie, sunny, …) */
function lobes(n: number, depth: number): string {
  const pts: string[] = []
  for (let i = 0; i < 240; i++) {
    const t = (i / 240) * Math.PI * 2
    const r = 92 * (1 - depth + depth * (0.5 + 0.5 * Math.cos(n * t)))
    pts.push(`${(r * Math.cos(t)).toFixed(2)} ${(r * Math.sin(t)).toFixed(2)}`)
  }
  return `M${pts.join("L")}Z`
}

export const shape = (n: number, depth: number, fill: string, inner = "") =>
  dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200"><path d="${lobes(n, depth)}" fill="${fill}"/>${inner}</svg>`
  )

/** the body of a bundled Material Symbols Rounded icon, filled */
export function glyph(name: string): string | undefined {
  const base = name.replaceAll("_", "-")
  for (const key of [`${base}-rounded`, `${base}-outline-rounded`, base]) {
    for (const set of [coreIcons, appIcons]) {
      const body = set.icons[key]?.body
      if (body) return body
    }
  }
  return undefined
}

/** the brand mark and name, top left of every card */
export function brand(): Node {
  return h("div", { display: "flex", alignItems: "center", gap: 14 }, [
    h("img", { width: 44, height: 44 }, undefined, {
      src: dataUri(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 144"><path fill="${PRIMARY}" d="${LOGO}"/></svg>`
      ),
    }),
    h(
      "div",
      { fontSize: 26, fontWeight: 500, color: ON_SURFACE_VARIANT },
      "shadcn M3E"
    ),
  ])
}

export function loadFonts(root: string) {
  const require = createRequire(path.join(root, "package.json"))
  const dir = path.join(
    path.dirname(require.resolve("@fontsource/roboto/package.json")),
    "files"
  )
  return ([400, 500] as const).map((weight) => ({
    name: "Roboto",
    weight,
    style: "normal" as const,
    data: fs.readFileSync(path.join(dir, `roboto-latin-${weight}-normal.woff`)),
  }))
}
