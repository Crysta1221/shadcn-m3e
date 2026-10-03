import { createFileRoute } from "@tanstack/react-router"

import { ExampleView } from "@/docs/example-view"
import { loadShowcases } from "@/docs/examples"

export const Route = createFileRoute("/examples")({
  loader: loadShowcases,
  component: ExamplesPage,
})

function ExamplesPage() {
  const examples = Route.useLoaderData()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 p-6 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-display-small-emphasized text-on-surface">
          Examples
        </h1>
        <p className="max-w-2xl text-body-large text-on-surface-variant">
          Components working together at page scale. Each one runs live inside a
          frame, and its source is one click away.
        </p>
      </header>
      {examples.map((e) => (
        <ExampleView key={e.id} example={e} large />
      ))}
    </div>
  )
}
