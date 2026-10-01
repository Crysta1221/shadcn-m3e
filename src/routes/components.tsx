import { createFileRoute } from "@tanstack/react-router"

import { ComponentsNav } from "@/docs/components-nav"
import { DocsShell } from "@/docs/shell"

export const Route = createFileRoute("/components")({
  component: () => (
    <DocsShell
      title="Components"
      nav={(onNavigate) => <ComponentsNav onNavigate={onNavigate} />}
    />
  ),
})
