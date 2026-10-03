import * as React from "react"
import { useNavigate } from "@tanstack/react-router"

import { SearchResult, SearchView } from "@/components/m3e/search"

import { DOCS } from "./registry"
import { GUIDE_PAGES } from "./outline"

const PAGES = [
  { to: "/theme", title: "Theme", icon: "palette" },
  { to: "/examples", title: "Examples", icon: "dashboard" },
] as const

/** Header search over the guide and the component reference (Ctrl/⌘K focuses). */
function DocsSearch() {
  const navigate = useNavigate()
  const [value, setValue] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const q = value.trim().toLowerCase()
  const match = (texts: string[]) =>
    texts.some((t) => t.toLowerCase().includes(q))

  const comps = q ? DOCS.filter((d) => match([d.name, d.slug, d.category])) : []
  const pages = q ? GUIDE_PAGES.filter((p) => match([p.title, p.slug])) : []
  const site = q ? PAGES.filter((p) => match([p.title, p.to])) : []

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        document
          .querySelector<HTMLInputElement>('[data-slot="search-view"] input')
          ?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const goComponent = (slug: string) => {
    setOpen(false)
    void navigate({ to: "/components/$slug", params: { slug } })
  }
  const goGuide = (slug: string) => {
    setOpen(false)
    void navigate({ to: "/docs/$slug", params: { slug } })
  }

  return (
    <SearchView
      size="sm"
      className="absolute inset-x-0 top-0"
      value={value}
      onValueChange={setValue}
      open={open && Boolean(q)}
      onOpenChange={setOpen}
      onSubmit={() => {
        const d = comps[0]
        if (d) return goComponent(d.slug)
        const p = pages[0]
        if (p) return goGuide(p.slug)
        if (site[0]) {
          setOpen(false)
          void navigate({ to: site[0].to })
        }
      }}
      placeholder="Search docs"
      aria-label="Search docs"
    >
      {comps.map((d) => (
        <SearchResult
          key={`c-${d.slug}`}
          icon={d.icon}
          trailing="Components"
          onClick={() => goComponent(d.slug)}
        >
          {d.name}
        </SearchResult>
      ))}
      {pages.map((p) => (
        <SearchResult
          key={`g-${p.slug}`}
          icon={p.icon}
          trailing="Docs"
          onClick={() => goGuide(p.slug)}
        >
          {p.title}
        </SearchResult>
      ))}
      {site.map((p) => (
        <SearchResult
          key={`s-${p.to}`}
          icon={p.icon}
          trailing="Page"
          onClick={() => {
            setOpen(false)
            void navigate({ to: p.to })
          }}
        >
          {p.title}
        </SearchResult>
      ))}
      {q && !comps.length && !pages.length && !site.length && (
        <div className="px-4 py-6 text-center text-body-medium text-on-surface-variant">
          No results for “{value.trim()}”
        </div>
      )}
    </SearchView>
  )
}

export { DocsSearch }
