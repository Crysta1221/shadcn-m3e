// bun run registry:build
//
// Builds the shadcn registry into apps/docs/public/r:
//
//   registry.json   index of every item
//   <name>.json     one item: its files (with contents), the npm packages it
//                   needs and the other items it needs
//
// and apps/docs/src/docs/registry-meta.generated.ts, which the docs use to
// show install commands, dependencies and icons on each component page.
//
// The registry describes files the way a consumer's project sees them
// (src/components/m3e/…); in this repository they live in packages/m3e (see
// SOURCES), so the output is the same as before the repository was split.
//
// Items are derived from the source, nothing is listed by hand:
//   src/components/m3e/<x>.tsx   one item each ("button", "card"…)
//   groups below                 files that only work together (icon, theme…)
//   dependencies                 from the imports of each file
//
// Consumers add the registry to components.json and install by name:
//   "registries": { "@m3e": "https://shadcn-m3e.crystaworld.dev/r/{name}.json" }
//   npx shadcn@latest add @m3e/button
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { basename, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const NS = "@m3e"
const PKG = fileURLToPath(new URL("..", import.meta.url))
const DOCS = join(PKG, "..", "..", "apps", "docs")
const OUT = join(DOCS, "public", "r")
const META_OUT = join(DOCS, "src", "docs", "registry-meta.generated.ts")
const COMPONENTS = "src/components/m3e"
const LIB = "src/lib/m3e"

/** published path prefix -> directory in packages/m3e */
const SOURCES = [
  [COMPONENTS, "src/components"],
  [LIB, "src/lib"],
  ["src/hooks", "src/hooks"],
  ["src/styles", "src/styles"],
  ["scripts", "scripts"],
]
const real = (path) => {
  for (const [published, dir] of SOURCES)
    if (path === published || path.startsWith(published + "/"))
      return join(PKG, dir, path.slice(published.length))
  throw new Error(`${path} is not under a known source directory`)
}
const homepage =
  process.env.M3E_REGISTRY_HOMEPAGE ?? "https://shadcn-m3e.crystaworld.dev"

/** files installed under `components` / `lib` (shadcn aliases), or the project root */
const target = (path) => {
  if (path.startsWith(COMPONENTS + "/"))
    return `@components/m3e/${path.slice(COMPONENTS.length + 1)}`
  if (path.startsWith(LIB + "/"))
    return `@lib/m3e/${path.slice(LIB.length + 1)}`
  if (path.startsWith("src/hooks/"))
    return `@hooks/${path.slice("src/hooks/".length)}`
  return `~/${path}`
}

/** what a file is, for the registry */
const typeOf = (path) => {
  if (path.startsWith("src/hooks/")) return "registry:hook"
  if (path.startsWith(COMPONENTS + "/")) {
    if (/\/use-[^/]+\.ts$/.test(path)) return "registry:hook"
    return path.endsWith(".tsx") ? "registry:ui" : "registry:lib"
  }
  if (path.startsWith(LIB + "/") && /\.tsx?$/.test(path)) return "registry:lib"
  return "registry:file"
}

// --- groups ---------------------------------------------------------------------

/** items made of several files, or files outside components/m3e */
const GROUPS = {
  styles: {
    title: "M3E styles",
    description:
      "Design tokens (color roles, shape, type, elevation, motion springs) and the Tailwind utilities built on them: state-layer, focus-ring, transition-shape, motion-*.",
    files: ["src/styles/m3e.css", "src/styles/m3e.generated.css"],
    // installed next to the rest of the M3E lib code
    targets: {
      "src/styles/m3e.css": "@lib/m3e/m3e.css",
      "src/styles/m3e.generated.css": "@lib/m3e/m3e.generated.css",
    },
    dependencies: [
      "@fontsource-variable/roboto-flex",
      "@fontsource-variable/jetbrains-mono",
      "tw-animate-css",
      "shadcn",
    ],
    docs: [
      "Import the styles after Tailwind in your main CSS file:",
      '  @import "tailwindcss";',
      '  @import "tw-animate-css";',
      '  @import "shadcn/tailwind.css";',
      '  @import "@fontsource-variable/roboto-flex";',
      '  @import "@fontsource-variable/jetbrains-mono";',
      '  @import "./lib/m3e/m3e.css";   /* the path from that file to lib/m3e/m3e.css */',
    ].join("\n"),
  },
  cn: {
    title: "cn",
    description:
      "cn() that knows the M3 type scale and elevation shadows, so text-label-large is not mistaken for a text color.",
    files: [`${LIB}/cn.ts`],
  },
  shapes: {
    title: "Shapes",
    description: "Shape geometry and morphing used by the loading indicator.",
    files: [`${LIB}/shapes.ts`],
  },
  shape: {
    title: "Shape",
    description:
      "The Material shape library (35 shapes) as a clip-path: clips its content and morphs between shapes on the slow effects spring.",
    files: [`${COMPONENTS}/shape.tsx`, `${LIB}/shape-library.ts`],
  },
  icon: {
    title: "Icon",
    description:
      "Material Symbols Rounded, bundled: only the glyphs your code uses are shipped, nothing is fetched at runtime. Includes scripts/icons.mjs, which regenerates the bundled data.",
    files: [
      `${COMPONENTS}/icon.tsx`,
      `${COMPONENTS}/icon-registry.ts`,
      `${COMPONENTS}/icon-data.ts`,
      `${COMPONENTS}/icon-data.app.ts`,
      `${COMPONENTS}/symbols.tsx`,
      "scripts/icons.mjs",
    ],
    // icon-data.app.ts is yours: it ships empty and `gen:icons` fills it
    stubs: {
      [`${COMPONENTS}/icon-data.app.ts`]: `import type { IconifyJSON } from "@iconify/react/offline"

// Generated by scripts/icons.mjs (bun run gen:icons): the icons your app uses.
const data: IconifyJSON = {
  prefix: "material-symbols",
  width: 24,
  height: 24,
  icons: {},
}

export default data
`,
    },
    docs: [
      "Add the scripts to package.json, then run gen:icons whenever you use a new icon:",
      '  "gen:icons": "node scripts/icons.mjs",',
      '  "check:icons": "node scripts/icons.mjs --check"',
    ].join("\n"),
  },
  theme: {
    title: "Theme provider",
    description:
      "Light/dark switching (ColorModeProvider) and the M3 color scheme (M3ThemeProvider): change every color at runtime from a color code, with contrast, variants and shape/motion settings. M3eProvider sets up both. Includes a scope for themed subtrees.",
    files: [
      `${COMPONENTS}/m3e-provider.tsx`,
      `${COMPONENTS}/color-mode-provider.tsx`,
      `${COMPONENTS}/m3-theme-provider.tsx`,
      `${COMPONENTS}/m3-theme-scope.tsx`,
      `${LIB}/color.ts`,
      `${LIB}/baseline.ts`,
    ],
    docs: ["Wrap your app once:", "  <M3eProvider>…</M3eProvider>"].join("\n"),
  },
  "use-mobile": {
    title: "useIsMobile",
    description:
      "Hook that tells whether the viewport is narrower than 768px (used by the sidebar).",
    files: ["src/hooks/use-mobile.ts"],
  },
  "use-image-theme": {
    title: "Theme from an image",
    description:
      "useImageTheme(): pick swatches from an image with node-vibrant and apply them as the color scheme.",
    files: [`${COMPONENTS}/use-image-theme.ts`, `${LIB}/vibrant.ts`],
  },
}

// items with no files of their own
const META = {
  base: {
    title: "M3E base",
    description:
      "Everything a project needs once: styles, cn, theme provider and icons. Components pull in what they need on their own; run this first to set up.",
    registryDependencies: ["styles", "cn", "theme", "icon"],
  },
}

// --- read the source ----------------------------------------------------------

const read = (p) => readFileSync(real(p), "utf8")
const listFiles = (dir) =>
  readdirSync(real(dir))
    .filter((f) => /\.tsx?$/.test(f))
    .toSorted()

/** file path -> item name */
const owner = new Map()
for (const [name, g] of Object.entries(GROUPS))
  for (const f of g.files) owner.set(f, name)

const items = new Map()
for (const [name, g] of Object.entries(GROUPS)) {
  items.set(name, { name, ...g, targets: g.targets ?? {} })
}
for (const f of listFiles(COMPONENTS)) {
  const path = `${COMPONENTS}/${f}`
  if (owner.has(path)) continue
  const name = basename(f).replace(/\.tsx?$/, "")
  owner.set(path, name)
  items.set(name, { name, files: [path], targets: {} })
}
for (const f of listFiles(LIB)) {
  const path = `${LIB}/${f}`
  if (!owner.has(path)) throw new Error(`${path} belongs to no registry item`)
}

/** module specifier -> owning item, for the imports inside our own code */
const moduleOwner = (spec) => {
  const hook = /^@\/hooks\/([^/]+)$/.exec(spec)
  if (hook) return owner.get(`src/hooks/${hook[1]}.ts`) ?? null
  const m = /^@\/(components|lib)\/m3e\/([^/]+)$/.exec(spec)
  if (!m) return null
  const dir = m[1] === "components" ? COMPONENTS : LIB
  for (const ext of [".tsx", ".ts"]) {
    const item = owner.get(`${dir}/${m[2]}${ext}`)
    if (item) return item
  }
  throw new Error(`Unknown import ${spec}`)
}

const packageOf = (spec) => {
  if (spec.startsWith("@/") || spec.startsWith(".") || spec.startsWith("node:"))
    return null
  const parts = spec.split("/")
  const pkg = spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
  return pkg === "react" || pkg === "react-dom" ? null : pkg
}

// icons: symbols.tsx maps identifiers (CheckIcon) to glyph names
const symbolIcons = new Map()
for (const m of read(`${COMPONENTS}/symbols.tsx`).matchAll(
  /export const (\w+) = symbol\("([a-z0-9-]+)"\)/g
))
  symbolIcons.set(m[1], {
    name: m[2].replace(/(-outline)?-rounded$/, "").replaceAll("-", "_"),
    glyph: m[2],
  })

/**
 * Icon names written in JSX: `icon="x"` on anything, and `name="x"` on
 * <Icon> only (other elements have their own `name`, e.g. form fields).
 * Also the strings in `name={open ? "x" : "y"}`.
 */
function iconAttrs(src) {
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

/** name (as written in code) -> a glyph that is in the bundled data */
function iconsOf(src) {
  const out = new Map()
  const logical = (n) => out.set(n, `${n.replaceAll("_", "-")}-outline-rounded`)
  for (const n of iconAttrs(src)) logical(n)
  for (const m of src.matchAll(/\b(\w+Icon)\b/g)) {
    const s = symbolIcons.get(m[1])
    if (s) out.set(s.name, s.glyph)
  }
  return out
}

// A dependency this package pins to an exact version (recharts) is published
// as name@version, so `shadcn add` installs the version the components were
// written against; ranges (^1.2.3) are left to the consumer's package manager.
const PINNED = JSON.parse(
  readFileSync(join(PKG, "package.json"), "utf8")
).dependencies
const withVersion = (pkg) =>
  /^\d+\.\d+\.\d+$/.test(PINNED[pkg] ?? "") ? `${pkg}@${PINNED[pkg]}` : pkg

const title = (name) =>
  name
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ")

// --- build ------------------------------------------------------------------------

const built = []
for (const item of items.values()) {
  const npm = new Set(item.dependencies ?? [])
  const deps = new Set(item.registryDependencies ?? [])
  const icons = new Map()
  const files = []

  for (const path of item.files) {
    const source = read(path)
    for (const m of source.matchAll(/(?:from|import\()\s*"([^"]+)"/g)) {
      const other = moduleOwner(m[1])
      if (other && other !== item.name) deps.add(other)
      const pkg = packageOf(m[1])
      if (pkg) npm.add(pkg)
    }
    for (const [n, g] of iconsOf(source)) icons.set(n, g)
    files.push({
      path,
      type: typeOf(path),
      target: item.targets[path] ?? target(path),
      content: item.stubs?.[path] ?? source,
    })
  }
  // every component needs the tokens
  if (item.name !== "styles" && files.some((f) => f.type === "registry:ui"))
    deps.add("styles")
  deps.delete(item.name)

  built.push({
    name: item.name,
    type: files.some((f) => f.type === "registry:ui")
      ? "registry:ui"
      : files.every((f) => f.type === "registry:file")
        ? "registry:file"
        : files.some((f) => f.type === "registry:hook")
          ? "registry:hook"
          : "registry:lib",
    title: item.title ?? title(item.name),
    description:
      item.description ??
      `${item.title ?? title(item.name)} — Material 3 Expressive, based on shadcn/ui.`,
    dependencies: [...npm]
      .toSorted((a, b) => a.localeCompare(b))
      .map(withVersion),
    registryDependencies: [...deps]
      .toSorted((a, b) => a.localeCompare(b))
      .map((d) => `${NS}/${d}`),
    files,
    docs: item.docs,
    icons: [...icons]
      .toSorted(([a], [b]) => a.localeCompare(b))
      .map(([name, glyph]) => ({ name, glyph })),
  })
}
for (const [name, m] of Object.entries(META))
  built.push({
    name,
    type: "registry:lib",
    title: m.title,
    description: m.description,
    dependencies: [],
    registryDependencies: m.registryDependencies.map((d) => `${NS}/${d}`),
    files: [],
    icons: [],
  })

// everything at once
built.push({
  name: "all",
  type: "registry:lib",
  title: "All of M3E",
  description: "Every M3E component, plus the base.",
  dependencies: [],
  registryDependencies: built
    .filter((b) => b.type === "registry:ui" || b.name === "base")
    .map((b) => `${NS}/${b.name}`)
    .toSorted(),
  files: [],
  icons: [],
})

// --- write ------------------------------------------------------------------------

if (existsSync(OUT)) rmSync(OUT, { recursive: true })
mkdirSync(OUT, { recursive: true })

const SCHEMA_ITEM = "https://ui.shadcn.com/schema/registry-item.json"
for (const b of built) {
  const { icons: _icons, ...item } = b
  writeFileSync(
    join(OUT, `${b.name}.json`),
    JSON.stringify(
      {
        $schema: SCHEMA_ITEM,
        ...item,
        docs: b.docs,
        files: b.files.map(({ path, type, target: t, content }) => ({
          path,
          type,
          target: t,
          content,
        })),
      },
      null,
      2
    )
  )
}
writeFileSync(
  join(OUT, "registry.json"),
  JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "shadcn-m3e",
      homepage,
      items: built.map((b) => ({
        name: b.name,
        type: b.type,
        title: b.title,
        description: b.description,
        dependencies: b.dependencies,
        registryDependencies: b.registryDependencies,
        files: b.files.map(({ path, type, target: t }) => ({
          path,
          type,
          target: t,
        })),
      })),
    },
    null,
    2
  )
)

const meta = Object.fromEntries(
  built.map((b) => [
    b.name,
    {
      title: b.title,
      type: b.type,
      dependencies: b.dependencies,
      registryDependencies: b.registryDependencies.map((d) =>
        d.slice(NS.length + 1)
      ),
      icons: b.icons,
      files: b.files.map((f) => ({ path: f.path, target: f.target })),
    },
  ])
)
writeFileSync(
  META_OUT,
  `// Generated by packages/m3e/scripts/build-registry.mjs (bun run registry:build). Do not edit.
export type RegistryMeta = {
  title: string
  type: string
  /** npm packages */
  dependencies: string[]
  /** other items of this registry */
  registryDependencies: string[]
  /** Material Symbols the item uses; glyph is an Iconify name that is bundled */
  icons: { name: string; glyph: string }[]
  files: { path: string; target: string }[]
}

export const REGISTRY_META: Record<string, RegistryMeta> = ${JSON.stringify(meta, null, 2)}
`
)
console.log(
  `registry: ${built.length} items -> ${relative(join(PKG, "..", ".."), OUT).replaceAll("\\", "/")}`
)
