// bun run gen:icons     write the bundled icon data
// bun run check:icons   verify it (CI): every used icon exists and is bundled
//
// Icons are Material Symbols Rounded from Iconify. Instead of loading them from
// the Iconify API at runtime, the glyphs the code uses are written to two files
// and registered with @iconify/react/offline:
//
//   icon-data.ts      "core": icons used inside the M3E components themselves
//                     (this file ships with the registry)
//   icon-data.app.ts  "app":  icons used by everything else in src/
//                     (yours: the registry ships an empty one)
//
// What counts as "used": name="x" / icon="x" attributes (also the strings in
// name={a ? "x" : "y"}), `icon: "x"` fields,
// ["x", "Label"] pairs, symbol("x-rounded") in symbols.tsx, and a
// `// @icons x y z` line for names built at runtime.
//
// Options: --src <dir[,dir…]> (default src)  --dir <m3e components dir>
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join, relative } from "node:path"

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : fallback
}
const CHECK = args.includes("--check")
const SRCS = flag("--src", "src").split(",")
const DIR = flag("--dir", join(SRCS[0], "components", "m3e"))
const CORE_OUT = join(DIR, "icon-data.ts")
const APP_OUT = join(DIR, "icon-data.app.ts")
const PREFIX = "material-symbols"
const norm = (p) => p.replaceAll("\\", "/")

// --- what is used -----------------------------------------------------------

/**
 * Icon names written in JSX: `icon="x"` on anything, and `name="x"` on
 * <Icon> only (other elements have their own `name`, e.g. form fields).
 * Also the strings in `name={open ? "x" : "y"}`.
 */
export function iconAttrs(src) {
  const out = []
  const scan = (text, attr) => {
    for (const m of text.matchAll(new RegExp(`\\b${attr}="([a-z0-9_]+)"`, "g")))
      out.push(m[1])
    for (const m of text.matchAll(new RegExp(`\\b${attr}=\\{([^{}]*)\\}`, "g")))
      for (const n of m[1]
        .replace(/[!=]==?\s*"[^"]*"/g, "")
        .matchAll(/"([a-z][a-z0-9_]*)"/g))
        out.push(n[1])
  }
  scan(src, "icon")
  for (const tag of src.matchAll(/<Icon\b[^>]*>/g)) scan(tag[0], "name")
  return out
}

const addTo = (map, name, file) =>
  map.set(name, [...(map.get(name) ?? []), file])

/** logical names ("arrow_back": both variants) and raw Iconify names */
const scan = (inCore) => {
  const logical = new Map()
  const raw = new Map()
  const walk = (dir) => {
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, f.name)
      const q = norm(p)
      if (f.isDirectory()) {
        if (!q.endsWith("components/ui")) walk(p)
        continue
      }
      if (!/\.tsx?$/.test(f.name) || /icon-data/.test(f.name)) continue
      const core = q.startsWith(norm(DIR) + "/")
      if (core !== inCore) continue
      const src = readFileSync(p, "utf8")
      const file = relative(process.cwd(), p).replaceAll("\\", "/")
      for (const n of iconAttrs(src)) addTo(logical, n, file)
      for (const m of src.matchAll(/\bicon:\s*"([a-z0-9_]+)"/g))
        addTo(logical, m[1], file)
      for (const m of src.matchAll(/\["([a-z0-9_]+)",\s*"[A-Z]/g))
        addTo(logical, m[1], file)
      for (const m of src.matchAll(/\/\/\s*@icons\s+([a-z0-9_ ]+)/g))
        for (const n of m[1].trim().split(/\s+/)) addTo(logical, n, file)
      for (const m of src.matchAll(/\bsymbol\("([a-z0-9-]+)"\)/g))
        addTo(raw, m[1], file)
    }
  }
  for (const dir of SRCS) walk(dir)
  return { logical, raw }
}

/** Iconify names for a scan */
const iconifyNames = ({ logical, raw }) => {
  const out = new Map()
  for (const [n, files] of logical) {
    const k = n.replaceAll("_", "-")
    out.set(`${k}-outline-rounded`, files[0])
    out.set(`${k}-rounded`, files[0])
  }
  for (const [n, files] of raw) out.set(n, files[0])
  return out
}

// --- Iconify ------------------------------------------------------------------

async function get(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Iconify API: ${res.status}`)
      return await res.json()
    } catch (e) {
      if (attempt === 4) throw e
      await new Promise((r) => setTimeout(r, 1500 * attempt))
    }
  }
}

async function fetchIcons(names) {
  const icons = {}
  const aliases = {}
  const missing = []
  const list = [...names]
  for (let i = 0; i < list.length; i += 60) {
    const chunk = list.slice(i, i + 60)
    const json = await get(
      `https://api.iconify.design/${PREFIX}.json?icons=${chunk.join(",")}`
    )
    Object.assign(icons, json.icons)
    Object.assign(aliases, json.aliases)
    missing.push(...(json.not_found ?? []))
  }
  return { icons, aliases, missing }
}

const sortKeys = (o) =>
  Object.fromEntries(
    Object.entries(o).toSorted(([a], [b]) => a.localeCompare(b))
  )

const render = (data, note) =>
  `// Generated by scripts/icons.mjs (bun run gen:icons). Do not edit.
// ${note}
// Material Symbols Rounded, Apache-2.0, via Iconify.
import type { IconifyJSON } from "@iconify/react/offline"

const data: IconifyJSON = ${JSON.stringify(data, null, 2)}

export default data
`

const keysOf = (file) => {
  if (!existsSync(file)) return null
  const s = readFileSync(file, "utf8")
  try {
    const json = JSON.parse(
      s.slice(s.indexOf("= ") + 2, s.lastIndexOf("\n\nexport default"))
    )
    return Object.keys(json.icons ?? {}).toSorted()
  } catch {
    return null
  }
}

// --- run ------------------------------------------------------------------------

let failed = false
for (const [inCore, out, note] of [
  [true, CORE_OUT, "Icons used inside the M3E components."],
  [false, APP_OUT, "Icons used by this app, outside the M3E components."],
]) {
  const names = iconifyNames(scan(inCore))
  if (!inCore) for (const n of iconifyNames(scan(true)).keys()) names.delete(n)
  const { icons, aliases, missing } = await fetchIcons(names.keys())

  for (const m of missing) {
    failed = true
    console.log(`no such glyph: ${m}  (${names.get(m)})`)
  }

  const data = {
    prefix: PREFIX,
    width: 24,
    height: 24,
    icons: sortKeys(icons),
    ...(Object.keys(aliases).length ? { aliases: sortKeys(aliases) } : {}),
  }
  const want = Object.keys(data.icons)
  const have = keysOf(out)
  const same =
    have && have.length === want.length && have.every((k, i) => k === want[i])

  if (CHECK) {
    if (!same) {
      failed = true
      console.log(`${norm(out)} is out of date, run: bun run gen:icons`)
    }
  } else if (!same || have === null) {
    writeFileSync(out, render(data, note))
    console.log(`wrote ${norm(out)} (${want.length} icons)`)
  } else {
    console.log(`${norm(out)} is up to date (${want.length} icons)`)
  }
}
process.exitCode = failed ? 1 : 0
