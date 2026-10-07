import * as React from "react"
import { Link } from "@tanstack/react-router"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { cn } from "@/lib/utils"

import { CodeBlock } from "./code-block"
import type { Example } from "./examples"
import { InlineText } from "./inline-text"
import { DOCS } from "./registry"

/*
 * A transformed ancestor becomes the containing block of `position: fixed`
 * descendants, so an app shell lays out inside the frame instead of over the
 * whole docs page. The sidebar's viewport-height classes are reset to fill it.
 */
const FRAME =
  "relative overflow-hidden transform-gpu [&_[data-slot=sidebar-container]]:h-full [&_[data-slot=sidebar-wrapper]]:h-full [&_[data-slot=sidebar-wrapper]]:min-h-0"

/** one live demo with its source underneath */
function ExampleView({
  example,
  large,
}: {
  example: Example
  /** a bigger title, for page-scale examples */
  large?: boolean
}) {
  const { id: exampleId, meta, Component, code } = example
  const [open, setOpen] = React.useState(false)
  const id = React.useId()

  return (
    <section
      id={exampleId}
      data-slot="example"
      className="flex scroll-mt-20 flex-col gap-3"
      aria-labelledby={id}
    >
      <div>
        <h3
          id={id}
          className={cn(
            "text-on-surface",
            large ? "text-headline-small" : "text-title-medium"
          )}
        >
          {meta.title}
        </h3>
        {meta.description && (
          <p className="text-body-medium text-on-surface-variant">
            <InlineText text={meta.description} />
          </p>
        )}
        {meta.uses && (
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-label-medium text-on-surface-variant">
            Built with
            {meta.uses.map((slug) => (
              <Link
                key={slug}
                to="/components/$slug"
                params={{ slug }}
                className="rounded-sm bg-secondary-container px-2 py-0.5 text-on-secondary-container hover:underline"
              >
                {DOCS.find((d) => d.slug === slug)?.name ?? slug}
              </Link>
            ))}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-outline-variant">
        <div
          className={cn(
            "bg-surface",
            meta.frame
              ? FRAME
              : cn(
                  "p-6",
                  meta.layout === "block"
                    ? "block"
                    : "flex min-h-32 flex-wrap items-center justify-center gap-3"
                )
          )}
          style={meta.frame ? { height: meta.frame } : undefined}
        >
          <Component />
        </div>
        <div className="flex justify-end border-t border-outline-variant bg-surface-container-low px-2 py-1">
          <Button
            variant="text"
            size="sm"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-on-surface-variant"
          >
            <Icon name={open ? "code_off" : "code"} size={20} />
            {open ? "Hide code" : "Show code"}
          </Button>
        </div>
        {open && (
          <CodeBlock
            code={code}
            className="rounded-none border-t border-outline-variant"
          />
        )}
      </div>
    </section>
  )
}

export { ExampleView }
