import { Link, createFileRoute } from "@tanstack/react-router"

import { Icon } from "@/components/m3e/icon"
import { Badge } from "@/components/m3e/badge"
import { countExamples } from "@/docs/examples"
import { CATEGORIES, DOCS } from "@/docs/registry"

export const Route = createFileRoute("/components/")({
  component: ComponentsOverview,
})

function ComponentsOverview() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 p-6 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-display-small-emphasized text-on-surface">
          Components
        </h1>
        <p className="max-w-2xl text-body-large text-on-surface-variant">
          {DOCS.length} components. Every shadcn/ui component restyled as
          Material 3 Expressive, plus the M3E components shadcn does not have.
          Import from <code>@/components/m3e/*</code>.
        </p>
        <div>
          <Link
            to="/showcase"
            className="inline-flex items-center gap-2 text-label-large text-primary hover:underline"
          >
            <Icon name="grid_view" size={20} />
            See everything on one page
          </Link>
        </div>
      </header>

      {CATEGORIES.map((category) => {
        const items = DOCS.filter((d) => d.category === category)
        if (!items.length) return null
        return (
          <section key={category} className="flex flex-col gap-3">
            <h2 className="text-title-large text-on-surface">{category}</h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((d) => (
                <li key={d.slug}>
                  <Link
                    to="/components/$slug"
                    params={{ slug: d.slug }}
                    className="state-layer relative flex h-full flex-col gap-2 rounded-lg bg-surface-container p-4 focus-ring outline-none"
                  >
                    <span className="flex items-center gap-3 text-on-surface">
                      <Icon name={d.icon} className="text-primary" />
                      <span className="text-title-medium">{d.name}</span>
                      {d.origin === "m3e" && (
                        <Badge variant="tertiary" className="ml-auto">
                          M3E
                        </Badge>
                      )}
                    </span>
                    <span className="line-clamp-2 text-body-medium text-on-surface-variant">
                      {d.description}
                    </span>
                    <span className="mt-auto text-label-small text-on-surface-variant">
                      {countExamples(d.slug)} example
                      {countExamples(d.slug) === 1 ? "" : "s"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
