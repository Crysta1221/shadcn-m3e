import * as React from "react"
import { useNavigate } from "@tanstack/react-router"

import { Button } from "@/components/m3e/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/m3e/command"
import { Icon } from "@/components/m3e/icon"
import { SearchResult, SearchView } from "@/components/m3e/search"

import { DOCS } from "./registry"
import { GUIDE_PAGES } from "./outline"

const PAGES = [
  { to: "/theme", title: "Theme", icon: "palette" },
  { to: "/examples", title: "Examples", icon: "dashboard" },
] as const

type DocsSearchContextValue = {
  value: string
  setValue: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  commandOpen: boolean
  setCommandOpen: (open: boolean) => void
  goComponent: (slug: string) => void
  goGuide: (slug: string) => void
  goPage: (to: (typeof PAGES)[number]["to"]) => void
}

const DocsSearchContext = React.createContext<DocsSearchContextValue | null>(
  null
)

function useDocsSearch() {
  const ctx = React.useContext(DocsSearchContext)
  if (!ctx) throw new Error("DocsSearch is rendered outside its provider")
  return ctx
}

/** Header search over the guide and the component reference.
 *  Desktop keeps the search bar (Ctrl/⌘K focuses it). On a phone the bar is an
 *  icon that opens this same index in a command dialog. */
function DocsSearchProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [value, setValue] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)

  const goComponent = React.useCallback(
    (slug: string) => {
      setOpen(false)
      setCommandOpen(false)
      void navigate({ to: "/components/$slug", params: { slug } })
    },
    [navigate]
  )
  const goGuide = React.useCallback(
    (slug: string) => {
      setOpen(false)
      setCommandOpen(false)
      void navigate({ to: "/docs/$slug", params: { slug } })
    },
    [navigate]
  )
  const goPage = React.useCallback(
    (to: (typeof PAGES)[number]["to"]) => {
      setOpen(false)
      setCommandOpen(false)
      void navigate({ to })
    },
    [navigate]
  )

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "k") return
      e.preventDefault()
      const mobile = window.matchMedia("(max-width: 767px)").matches
      if (mobile) {
        setCommandOpen((current) => !current)
        return
      }
      document
        .querySelector<HTMLInputElement>('[data-slot="search-view"] input')
        ?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const ctx = React.useMemo(
    () => ({
      value,
      setValue,
      open,
      setOpen,
      commandOpen,
      setCommandOpen,
      goComponent,
      goGuide,
      goPage,
    }),
    [value, open, commandOpen, goComponent, goGuide, goPage]
  )

  return (
    <DocsSearchContext.Provider value={ctx}>
      {children}
      <DocsCommand />
    </DocsSearchContext.Provider>
  )
}

function DocsSearchBar({ className }: { className?: string }) {
  const { value, setValue, open, setOpen, goComponent, goGuide, goPage } =
    useDocsSearch()
  const q = value.trim().toLowerCase()
  const match = (texts: string[]) =>
    texts.some((t) => t.toLowerCase().includes(q))

  const comps = q
    ? DOCS.filter((d) => match([d.name, d.slug, d.category, d.description]))
    : []
  const pages = q
    ? GUIDE_PAGES.filter((p) => match([p.title, p.slug, p.description]))
    : []
  const site = q ? PAGES.filter((p) => match([p.title, p.to])) : []

  return (
    <div className={className}>
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
          if (site[0]) goPage(site[0].to)
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
            onClick={() => goPage(p.to)}
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
    </div>
  )
}

/** Phone header: the search bar collapses to an icon that opens the command dialog. */
function DocsSearchButton() {
  const { setCommandOpen } = useDocsSearch()
  return (
    <Button
      variant="text"
      size="icon"
      aria-label="Search docs"
      title="Search docs"
      className="size-12 text-on-surface-variant md:hidden"
      onClick={() => setCommandOpen(true)}
    >
      <Icon name="search" />
    </Button>
  )
}

function DocsCommand() {
  const { commandOpen, setCommandOpen, goComponent, goGuide, goPage } =
    useDocsSearch()
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    if (!commandOpen) return undefined
    // The dialog just asked for a query; focus the field once it is mounted.
    const id = window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLInputElement>('[data-slot="command-input"]')
        ?.focus()
    })
    return () => window.cancelAnimationFrame(id)
  }, [commandOpen])

  return (
    <CommandDialog
      open={commandOpen}
      onOpenChange={(next) => {
        setCommandOpen(next)
        if (!next) setQuery("")
      }}
      title="Search docs"
      description="Search components, guides and pages"
    >
      <Command>
        <CommandInput
          placeholder="Search docs"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results for “{query.trim()}”</CommandEmpty>
          <CommandGroup heading="Components">
            {DOCS.map((d) => (
              <CommandItem
                key={d.slug}
                value={`${d.name} ${d.slug} ${d.category} ${d.description}`}
                onSelect={() => goComponent(d.slug)}
              >
                <Icon name={d.icon} size={20} />
                <span className="min-w-0 flex-1 truncate">{d.name}</span>
                <span className="text-label-medium text-on-surface-variant">
                  {d.category}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Docs">
            {GUIDE_PAGES.map((p) => (
              <CommandItem
                key={p.slug}
                value={`${p.title} ${p.slug} ${p.description}`}
                onSelect={() => goGuide(p.slug)}
              >
                <Icon name={p.icon} size={20} />
                <span className="min-w-0 flex-1 truncate">{p.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Pages">
            {PAGES.map((p) => (
              <CommandItem
                key={p.to}
                value={`${p.title} ${p.to}`}
                onSelect={() => goPage(p.to)}
              >
                <Icon name={p.icon} size={20} />
                <span className="min-w-0 flex-1 truncate">{p.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export { DocsSearchBar, DocsSearchButton, DocsSearchProvider }
