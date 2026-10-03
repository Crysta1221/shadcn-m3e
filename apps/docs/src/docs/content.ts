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
