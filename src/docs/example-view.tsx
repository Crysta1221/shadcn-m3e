import * as React from "react"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { cn } from "@/lib/utils"

import { CodeBlock } from "./code-block"
import type { Example } from "./examples"

/** one live demo with its source underneath */
function ExampleView({ example }: { example: Example }) {
  const { meta, Component, code } = example
  const [open, setOpen] = React.useState(!!meta.codeOnly)
  const id = React.useId()

  return (
    <section
      data-slot="example"
      className="flex flex-col gap-3"
      aria-labelledby={id}
    >
      <div>
        <h3 id={id} className="text-title-medium text-on-surface">
          {meta.title}
        </h3>
        {meta.description && (
          <p className="text-body-medium text-on-surface-variant">
            {meta.description}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-outline-variant">
        {!meta.codeOnly && (
          <div
            className={cn(
              "bg-surface p-6",
              meta.layout === "block"
                ? "block"
                : "flex min-h-32 flex-wrap items-center justify-center gap-3"
            )}
          >
            <Component />
          </div>
        )}
        {!meta.codeOnly && (
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
        )}
        {open && (
          <CodeBlock
            code={code}
            className={cn(
              "rounded-none",
              !meta.codeOnly && "border-t border-outline-variant"
            )}
          />
        )}
      </div>
    </section>
  )
}

export { ExampleView }
