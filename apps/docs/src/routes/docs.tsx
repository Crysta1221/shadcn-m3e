import { createFileRoute } from "@tanstack/react-router"

import { DocsNav } from "@/docs/docs-nav"
import { DocsShell } from "@/docs/shell"

export const Route = createFileRoute("/docs")({
  component: () => (
    <DocsShell
      title="Docs"
      nav={(onNavigate) => <DocsNav onNavigate={onNavigate} />}
    />
  ),
})
