import * as React from "react"

import { pageMeta } from "./page-meta"

const TAGS: [
  selector: string,
  attr: "content" | "href",
  key: "title" | "description" | "url" | "image" | "imageAlt",
][] = [
  ['meta[name="description"]', "content", "description"],
  ['link[rel="canonical"]', "href", "url"],
  ['meta[property="og:title"]', "content", "title"],
  ['meta[property="og:description"]', "content", "description"],
  ['meta[property="og:url"]', "content", "url"],
  ['meta[name="twitter:title"]', "content", "title"],
  ['meta[name="twitter:description"]', "content", "description"],
  ['meta[property="og:image"]', "content", "image"],
  ['meta[property="og:image:alt"]', "content", "imageAlt"],
  ['meta[name="twitter:image"]', "content", "image"],
  ['meta[name="twitter:image:alt"]', "content", "imageAlt"],
]

/**
 * Keeps the title and the SEO tags of index.html in step with the route after
 * client-side navigation. The first load already carries the right ones (the
 * prerendered HTML), so this only matters for visitors, tab titles and
 * history, and for crawlers that do run scripts.
 */
export function usePageMeta(pathname: string) {
  React.useEffect(() => {
    const meta = pageMeta(pathname)
    document.title = meta.title
    for (const [selector, attr, key] of TAGS) {
      document.head.querySelector(selector)?.setAttribute(attr, meta[key])
    }
    // only the 404 page asks to stay out of search results
    let robots = document.head.querySelector('meta[name="robots"]')
    if (meta.noindex) {
      if (!robots) {
        robots = document.createElement("meta")
        robots.setAttribute("name", "robots")
        document.head.append(robots)
      }
      robots.setAttribute("content", "noindex")
    } else {
      robots?.remove()
    }
  }, [pathname])
}
