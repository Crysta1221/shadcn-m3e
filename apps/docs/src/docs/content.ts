import {
  changelogMarkdown,
  isChangeEntry,
  type ChangeEntry,
} from "./changelog-format"

/** Guide pages, keyed by slug (`content/<slug>.md`) */
const files = import.meta.glob("./content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
})

export const CONTENT: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, src]) => [
    path.replace(/^.*\/(.+)\.md$/, "$1"),
    src,
  ])
)

const days = import.meta.glob<unknown>("./changelog/*.json", {
  import: "default",
  eager: true,
})

export const CHANGELOG: Record<string, ChangeEntry> = {}
for (const [path, entry] of Object.entries(days)) {
  if (isChangeEntry(entry)) {
    CHANGELOG[path.replace(/^.*\/(.+)\.json$/, "$1")] = entry
  }
}

/** The Changelog page is built from `changelog/<date>.json`, not a Markdown file */
CONTENT.changelog = changelogMarkdown(CHANGELOG)
