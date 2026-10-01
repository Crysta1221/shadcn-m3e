import { Link, createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/m3e/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/m3e/card"
import { Icon } from "@/components/m3e/icon"
import { CodeBlock } from "@/docs/code-block"

export const Route = createFileRoute("/")({ component: Home })

const SNIPPET = `import { Button } from "@/components/m3e/button"

<Button>Filled</Button>
<Button variant="tonal" size="lg" shape="square">Tonal</Button>`

function Home() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 p-6 py-12">
      <header className="flex flex-col gap-4">
        <h1 className="text-display-medium-emphasized text-on-surface">
          shadcn M3E
        </h1>
        <p className="max-w-2xl text-title-large text-on-surface-variant">
          Material 3 Expressive for shadcn/ui — Tailwind CSS v4, Base UI, and
          values taken straight from Google&apos;s Material tokens.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="md" render={<Link to="/docs" />} nativeButton={false}>
            <Icon name="menu_book" />
            Get started
          </Button>
          <Button
            size="md"
            variant="tonal"
            render={<Link to="/components" />}
            nativeButton={false}
          >
            <Icon name="widgets" />
            Components
          </Button>
          <Button
            size="md"
            variant="outlined"
            render={<Link to="/theme" />}
            nativeButton={false}
          >
            <Icon name="palette" />
            Theme from an image
          </Button>
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-headline-small text-on-surface">
          Use it like shadcn
        </h2>
        <p className="text-body-large text-on-surface-variant">
          Import from <code>@/components/m3e/*</code> instead of{" "}
          <code>@/components/ui/*</code>. There is nothing else to set up:{" "}
          <code>&lt;Button&gt;</code> is already expressive — press it to see
          the shape morph and ripple.
        </p>
        <CodeBlock code={SNIPPET} />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: "format_shapes",
            title: "Shape & motion",
            body: "Buttons morph on press, groups make room, springs come from the M3E motion scheme.",
          },
          {
            icon: "palette",
            title: "Dynamic color",
            body: "Baseline, any seed, or the swatches of an image via Vibrant. Light, dark and contrast levels.",
          },
          {
            icon: "extension",
            title: "Beyond shadcn",
            body: "Navigation, app bars, toolbars, FAB menu, search, carousel, time picker, loading indicator.",
          },
        ].map((f) => (
          <Card key={f.title} variant="filled">
            <CardHeader>
              <Icon name={f.icon} className="text-primary" />
              <CardTitle>{f.title}</CardTitle>
              <CardDescription>{f.body}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </section>
    </div>
  )
}
