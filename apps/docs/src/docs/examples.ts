import type * as React from "react"

export type ExampleMeta = {
  title: string
  description?: string
  /**
   * Height in px. The demo renders inside a frame that holds `position: fixed`
   * descendants (app shells), instead of loose on the page.
   */
  frame?: number
  /** "block" lets the demo use the full width instead of centering */
  layout?: "center" | "block"
  /** component slugs the demo is built from, linked under the title */
  uses?: string[]
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

/*
 * Demos pull in recharts, embla, the calendar and more, so none of them is
 * bundled with the page: each file is its own chunk, fetched by `loadExamples`
 * when its component page opens. The glob maps are lazy (path -> import()).
 */
const modules = import.meta.glob<ExampleModule>("./examples/*/*.tsx")
const sources = import.meta.glob<string>("./examples/*/*.tsx", {
  query: "?raw",
  import: "default",
})

const PATH = /\.\/examples\/([^/]+)\/([^/]+)\.tsx$/

const pathsBySlug = new Map<string, string[]>()
for (const path of Object.keys(modules).toSorted()) {
  const slug = PATH.exec(path)?.[1]
  if (!slug) continue
  pathsBySlug.set(slug, [...(pathsBySlug.get(slug) ?? []), path])
}

/** how many demos a component has; no demo code is loaded */
export const countExamples = (slug: string) =>
  pathsBySlug.get(slug)?.length ?? 0

async function build(
  path: string,
  load: () => Promise<ExampleModule>,
  source: () => Promise<string>
): Promise<Example> {
  const [mod, raw] = await Promise.all([load(), source()])
  // showcases are numbered to set their order; the number is not part of the anchor
  const id =
    PATH.exec(path)?.[2] ?? /(?:\d+-)?([^/]+)\.tsx$/.exec(path)?.[1] ?? path
  return {
    id,
    meta: mod.meta ?? { title: id.replace(/^\d+-/, "").replace(/-/g, " ") },
    Component: mod.default,
    code: raw.replace(/export const meta = \{[\s\S]*?\n\}\n\n?/, "").trim(),
  }
}

export const loadExamples = (slug: string) =>
  Promise.all(
    (pathsBySlug.get(slug) ?? []).map((path) =>
      build(path, modules[path], sources[path])
    )
  )

/*
 * Whole-page compositions for the Examples page, one file each in
 * `src/docs/showcases/`. Same format as a component demo.
 */
const showcaseModules = import.meta.glob<ExampleModule>("./showcases/*.tsx")
const showcaseSources = import.meta.glob<string>("./showcases/*.tsx", {
  query: "?raw",
  import: "default",
})

export const loadShowcases = () =>
  Promise.all(
    Object.keys(showcaseModules)
      .toSorted()
      .map((path) => build(path, showcaseModules[path], showcaseSources[path]))
  )
