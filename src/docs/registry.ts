/**
 * Everything the documentation site knows about a component. Live demos are
 * the files in `src/docs/examples/<slug>/*.tsx` (see `examples.ts`); the data
 * here is the prose, the import line and the props table.
 */
export const CATEGORIES = [
  "Actions",
  "Selection",
  "Text inputs",
  "Communication",
  "Containment",
  "Navigation",
  "Menus",
  "Pickers",
  "Content",
  "Chat",
  "Theming",
] as const
export type Category = (typeof CATEGORIES)[number]

export type PropRow = {
  name: string
  type: string
  default?: string
  description: string
}

export type DocEntry = {
  slug: string
  name: string
  category: Category
  /** Material Symbols name, shown in the navigation */
  icon: string
  /**
   * shadcn — a shadcn/ui component restyled as M3E (same API)
   * m3e    — a Material 3 Expressive component shadcn does not have
   */
  origin: "shadcn" | "m3e"
  description: string
  /** module file in `@/components/m3e` and what to import from it */
  imports: { from: string; names: string[] }[]
  props?: { title?: string; rows: PropRow[] }[]
  notes?: string[]
  /** Material Design guidance page */
  spec?: string
}

export const importLine = (i: DocEntry["imports"][number]) =>
  `import { ${i.names.join(", ")} } from "@/components/m3e/${i.from}"`

import { actions } from "./data/actions"
import { communication } from "./data/communication"
import { containment } from "./data/containment"
import { content } from "./data/content"
import { navigation } from "./data/navigation"
import { forms } from "./data/forms"
import { theming } from "./data/theming"

export const DOCS: DocEntry[] = [
  ...actions,
  ...forms,
  ...communication,
  ...containment,
  ...navigation,
  ...content,
  ...theming,
]
