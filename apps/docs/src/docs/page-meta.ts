import { SITE_ORIGIN } from "./origin"
import { GUIDE_PAGES } from "./outline"
import { DOCS } from "./registry"

/**
 * The title and description of every page, in one place for the two things
 * that need them: the head of the prerendered HTML (the `seo` plugin in
 * vite.config.ts, so link previews and search engines see per-page text) and
 * the document head after client-side navigation (`usePageMeta`). Only plain
 * data may be imported here; vite.config.ts loads this file in Node.
 */
export type PageMeta = {
  title: string
  description: string
  /** absolute URL of the page */
  url: string
}

const SITE_NAME = "shadcn M3E"
const SITE_TITLE = "shadcn M3E — Material 3 Expressive for shadcn/ui"
const SITE_DESCRIPTION =
  "Material 3 Expressive for shadcn/ui: shape-morphing buttons, springy motion and dynamic color, built with React 19, Tailwind CSS v4 and Base UI."

/** the preview card shown by Slack, X, Discord, …; see apps/docs/og */
export const OG_IMAGE = {
  url: `${SITE_ORIGIN}/og.png`,
  width: 1200,
  height: 630,
  alt: "shadcn M3E — Material 3 Expressive for shadcn/ui",
}

const STATIC_PAGES: Record<string, { title: string; description: string }> = {
  "/": { title: SITE_TITLE, description: SITE_DESCRIPTION },
  "/docs": {
    title: "Docs",
    description:
      "Install the registry, learn the foundations (color, shape, typography, motion) and move a shadcn/ui project to Material 3 Expressive.",
  },
  "/components": {
    title: "Components",
    description: `${DOCS.length} components: every shadcn/ui component restyled as Material 3 Expressive, plus the M3E components shadcn does not have.`,
  },
  "/examples": {
    title: "Examples",
    description:
      "Components working together at page scale: app shells, navigation and more, running live with their source.",
  },
  "/playground": {
    title: "Playground",
    description:
      "Sketch a screen with Material 3 Expressive components, then copy it as shadcn M3E code or as a prompt.",
  },
  "/theme": {
    title: "Theme",
    description:
      "Generate a Material 3 color scheme from a color code or an image and copy the CSS.",
  },
  "/showcase": {
    title: "Showcase",
    description: "Every shadcn M3E component on one page.",
  },
}

/** every path that has its own page, for prerendering */
export const PAGE_PATHS: string[] = [
  ...Object.keys(STATIC_PAGES),
  ...GUIDE_PAGES.map((p) => `/docs/${p.slug}`),
  ...DOCS.map((d) => `/components/${d.slug}`),
]

/** keep a description within what link previews show */
function clip(text: string, max = 200): string {
  const flat = text.replace(/\s+/g, " ").trim()
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).trimEnd()}…`
}

function titled(title: string): string {
  return `${title} — ${SITE_NAME}`
}

/** Meta for a pathname; unknown paths get the site defaults. */
export function pageMeta(pathname: string): PageMeta {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
  const url = `${SITE_ORIGIN}${path === "/" ? "" : path}`

  const fixed = STATIC_PAGES[path]
  if (fixed) {
    return {
      title: path === "/" ? fixed.title : titled(fixed.title),
      description: fixed.description,
      url,
    }
  }

  const [, section, slug] = path.split("/")
  if (section === "docs") {
    const page = GUIDE_PAGES.find((p) => p.slug === slug)
    if (page) {
      return {
        title: titled(page.title),
        description: clip(page.description),
        url,
      }
    }
  }
  if (section === "components") {
    const doc = DOCS.find((d) => d.slug === slug)
    if (doc) {
      return {
        title: titled(doc.name),
        description: clip(doc.description),
        url,
      }
    }
  }

  return { title: SITE_TITLE, description: SITE_DESCRIPTION, url: SITE_ORIGIN }
}

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

/** The tags of the `seo` block in index.html. */
export function headTags(meta: PageMeta): string {
  const m = (attr: "name" | "property", key: string, value: string) =>
    `    <meta ${attr}="${key}" content="${esc(value)}" />`
  return [
    `    <title>${esc(meta.title)}</title>`,
    m("name", "description", meta.description),
    `    <link rel="canonical" href="${esc(meta.url)}" />`,
    m("property", "og:type", "website"),
    m("property", "og:site_name", SITE_NAME),
    m("property", "og:locale", "en_US"),
    m("property", "og:title", meta.title),
    m("property", "og:description", meta.description),
    m("property", "og:url", meta.url),
    m("property", "og:image", OG_IMAGE.url),
    m("property", "og:image:width", String(OG_IMAGE.width)),
    m("property", "og:image:height", String(OG_IMAGE.height)),
    m("property", "og:image:alt", OG_IMAGE.alt),
    m("name", "twitter:card", "summary_large_image"),
    m("name", "twitter:title", meta.title),
    m("name", "twitter:description", meta.description),
    m("name", "twitter:image", OG_IMAGE.url),
  ].join("\n")
}
