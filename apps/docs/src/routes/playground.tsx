import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { buttonVariants } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { cn } from "@/lib/m3e/cn"
import { PLAYGROUND_ORIGIN } from "@/docs/site"

export const Route = createFileRoute("/playground")({
  component: PlaygroundPage,
})

function PlaygroundPage() {
  const [loaded, setLoaded] = useState(false)

  return (
    // the site header is 64dp and, under md, the navigation bar is 80dp
    <div className="flex h-[calc(100svh-4rem-5rem)] flex-col gap-3 p-3 md:h-[calc(100svh-4rem)]">
      <div className="flex items-center gap-3 px-1">
        <h1 className="text-title-large-emphasized text-on-surface">
          Playground
        </h1>
        <p className="min-w-0 flex-1 truncate text-body-medium text-on-surface-variant max-md:hidden">
          Sketch a screen, then copy it as shadcn M3E code or as a prompt.
        </p>
        <a
          href={PLAYGROUND_ORIGIN}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ variant: "tonal", size: "sm" }),
            "ml-auto"
          )}
        >
          <Icon name="open_in_new" />
          Open in a new tab
        </a>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-surface-container-low">
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center text-body-medium text-on-surface-variant">
            Loading the Playground…
          </div>
        )}
        {/* oxlint-disable-next-line react/iframe-missing-sandbox -- our own app on its own origin; it needs scripts and storage, which a sandbox that allowed both would not restrict anyway */}
        <iframe
          src={PLAYGROUND_ORIGIN}
          title="M3E Canvas"
          allow="clipboard-write"
          onLoad={() => setLoaded(true)}
          className="relative size-full border-0"
        />
      </div>
    </div>
  )
}
