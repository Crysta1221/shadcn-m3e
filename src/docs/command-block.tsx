import { Tabs, TabsList, TabsTrigger } from "@/components/m3e/tabs"

import { CodeBlock } from "./code-block"
import {
  PACKAGE_MANAGERS,
  isPackageManager,
  usePackageManager,
  withRunner,
} from "./package-manager"

/**
 * A shell command written with `npx`, shown for the reader's package manager
 * (npm, pnpm, bun, yarn). The choice is remembered and shared by every command
 * on the site.
 */
function CommandBlock({ command }: { command: string }) {
  const [pm, setPm] = usePackageManager()

  return (
    <Tabs
      value={pm}
      onValueChange={(v) => {
        if (isPackageManager(v)) setPm(v)
      }}
      className="gap-0 overflow-hidden rounded-md bg-surface-container-highest"
    >
      <TabsList variant="secondary" className="bg-transparent">
        {PACKAGE_MANAGERS.map((p) => (
          <TabsTrigger key={p} value={p}>
            {p}
          </TabsTrigger>
        ))}
      </TabsList>
      <CodeBlock
        lang="bash"
        code={withRunner(pm, command)}
        className="rounded-none bg-transparent"
      />
    </Tabs>
  )
}

export { CommandBlock }
