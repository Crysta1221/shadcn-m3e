import type * as React from "react"

export type ExampleMeta = {
  title: string
  description?: string
  /** the demo cannot render in the page (needs the whole window, etc.) */
  codeOnly?: boolean
  /** "block" lets the demo use the full width instead of centering */
  layout?: "center" | "block"
}

type ExampleModule = {
  default: React.ComponentType
  meta?: ExampleMeta
}

export type Example = {
  id: string
  meta: ExampleMeta
  Component: React.ComponentType
  /** the file as written, minus the `meta` export */
  code: string
}

const modules = import.meta.glob<ExampleModule>("./examples/*/*.tsx", {
  eager: true,
})
const sources = import.meta.glob<string>("./examples/*/*.tsx", {
  eager: true,
  query: "?raw",
  import: "default",
})

const bySlug = new Map<string, Example[]>()
for (const path of Object.keys(modules).toSorted()) {
  const [, slug, file] = /\.\/examples\/([^/]+)\/([^/]+)\.tsx$/.exec(path) ?? []
  if (!slug) continue
  const mod = modules[path]
  const raw = sources[path] ?? ""
  const list = bySlug.get(slug) ?? []
  list.push({
    id: file,
    meta: mod.meta ?? { title: file.replace(/^\d+-/, "").replace(/-/g, " ") },
    Component: mod.default,
    code: raw.replace(/export const meta = \{[\s\S]*?\n\}\n\n?/, "").trim(),
  })
  bySlug.set(slug, list)
}

export const getExamples = (slug: string): Example[] => bySlug.get(slug) ?? []
