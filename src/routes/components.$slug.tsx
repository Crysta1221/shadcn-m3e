import { Link, createFileRoute } from "@tanstack/react-router"

import { Badge } from "@/components/m3e/badge"
import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { CodeBlock } from "@/docs/code-block"
import { ExampleView } from "@/docs/example-view"
import { loadExamples } from "@/docs/examples"
import { PropsTable } from "@/docs/props-table"
import { RegistryInstall } from "@/docs/registry-install"
import { CATEGORIES, DOCS, importLine } from "@/docs/registry"

export const Route = createFileRoute("/components/$slug")({
  loader: ({ params }) => loadExamples(params.slug),
  component: ComponentPage,
})

const ORDER = CATEGORIES.flatMap((c) => DOCS.filter((d) => d.category === c))

function ComponentPage() {
  const { slug } = Route.useParams()
  const examples = Route.useLoaderData()
  const doc = DOCS.find((d) => d.slug === slug)

  if (!doc) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 p-6 py-16">
        <h1 className="text-headline-medium text-on-surface">
          No component called “{slug}”
        </h1>
        <Button render={<Link to="/components" />} nativeButton={false}>
          Back to components
        </Button>
      </div>
    )
  }

  const at = ORDER.findIndex((d) => d.slug === doc.slug)
  const prev = ORDER[at - 1]
  const next = ORDER[at + 1]

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-10 p-6 py-10">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-label-large text-on-surface-variant">
          <Link to="/components" className="hover:underline">
            Components
          </Link>
          <Icon name="chevron_right" size={18} />
          <span>{doc.category}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-display-small-emphasized text-on-surface">
            {doc.name}
          </h1>
          <Badge variant={doc.origin === "m3e" ? "tertiary" : "secondary"}>
            {doc.origin === "m3e" ? "M3E only" : "shadcn/ui + M3E"}
          </Badge>
        </div>
        <p className="text-body-large text-on-surface-variant">
          {doc.description}
        </p>
        {doc.spec && (
          <a
            href={doc.spec}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-1 text-label-large text-primary hover:underline"
          >
            Material Design guidelines
            <Icon name="open_in_new" size={18} />
          </a>
        )}
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Installation</h2>
        <RegistryInstall modules={doc.imports.map((i) => i.from)} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-headline-small text-on-surface">Import</h2>
        <CodeBlock code={doc.imports.map(importLine).join("\n")} />
      </section>

      {doc.notes && doc.notes.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-headline-small text-on-surface">Usage</h2>
          <ul className="flex list-disc flex-col gap-2 pl-6 text-body-large text-on-surface-variant">
            {doc.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      )}

      {doc.showcase && (
        <section className="flex flex-col items-start gap-3">
          <h2 className="text-headline-small text-on-surface">Examples</h2>
          <p className="text-body-large text-on-surface-variant">
            {doc.name} lays out a whole page, so it runs on the Examples page.
          </p>
          <Button
            variant="tonal"
            render={<Link to="/examples" hash={doc.showcase} />}
            nativeButton={false}
          >
            <Icon name="dashboard" size={20} />
            See it on the Examples page
          </Button>
        </section>
      )}

      {examples.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="text-headline-small text-on-surface">Examples</h2>
          {examples.map((e) => (
            <ExampleView key={e.id} example={e} />
          ))}
        </section>
      )}

      {doc.props && doc.props.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-headline-small text-on-surface">Props</h2>
          {doc.props.map((p, i) => (
            <PropsTable key={i} title={p.title} rows={p.rows} />
          ))}
          {doc.origin === "shadcn" && (
            <p className="text-body-small text-on-surface-variant">
              Everything else follows the shadcn/ui API of the same name (Base
              UI props are passed through).
            </p>
          )}
        </section>
      )}

      <nav
        aria-label="Previous and next component"
        className="flex justify-between gap-3 border-t border-outline-variant pt-6"
      >
        {prev ? (
          <Button
            variant="outlined"
            render={
              <Link to="/components/$slug" params={{ slug: prev.slug }} />
            }
            nativeButton={false}
          >
            <Icon name="arrow_back" size={20} />
            {prev.name}
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button
            variant="outlined"
            render={
              <Link to="/components/$slug" params={{ slug: next.slug }} />
            }
            nativeButton={false}
          >
            {next.name}
            <Icon name="arrow_forward" size={20} />
          </Button>
        )}
      </nav>
    </article>
  )
}
