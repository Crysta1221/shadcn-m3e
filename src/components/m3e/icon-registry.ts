import { addCollection, type IconifyJSON } from "@iconify/react/offline"

import appIcons from "./icon-data.app"
import coreIcons from "./icon-data"

/*
 * Icons are bundled, not fetched: the glyphs the code uses are written to
 * icon-data.ts (used inside the M3E components) and icon-data.app.ts (used by
 * your app) by `bun run gen:icons`, and registered here. Nothing is loaded
 * from the Iconify API at runtime, and only these glyphs end up in the bundle.
 */
// replaced by the bundler (Vite, Next…), so this is dev-only code
declare const process: { env: { NODE_ENV?: string } }

const known = new Set<string>()

/** register more icons, e.g. from an Iconify JSON file */
export function registerIcons(data: IconifyJSON) {
  addCollection(data)
  const prefix = data.prefix ?? ""
  for (const name of [
    ...Object.keys(data.icons ?? {}),
    ...Object.keys(data.aliases ?? {}),
  ])
    known.add(`${prefix}:${name}`)
}
registerIcons(coreIcons)
registerIcons(appIcons)

const warned = new Set<string>()

/** in development, say once when an icon was never bundled */
export function warnIfMissing(icon: string) {
  if (process.env.NODE_ENV === "production") return
  if (known.has(icon) || warned.has(icon)) return
  warned.add(icon)
  console.warn(`[m3e] Icon "${icon}" is not bundled. Run: bun run gen:icons`)
}
