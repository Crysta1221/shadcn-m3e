/**
 * One changelog entry is one file, `changelog/YYYY-MM-DD.json`: the date is the
 * file name, so there is no version to keep in step. The same files feed the
 * Changelog page (`content.ts`) and the announcement image (`og/update.ts`).
 * Plain data and functions only: the image script runs this file in Bun.
 */
export type ChangeItem = { type: string; text: string }
export type ChangeEntry = {
  /** a short theme for the day, shown under the date */
  title?: string
  /** Material Symbols name for the announcement image */
  icon?: string
  items: ChangeItem[]
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/** "2026-10-06" -> "Oct 6, 2026"; done by hand so the time zone cannot shift it */
export function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

/** feat and fix have their own labels and colors; any other type is shown as is */
export function typeLabel(type: string): string {
  if (type === "feat") return "New"
  if (type === "fix") return "Fix"
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function isChangeEntry(value: unknown): value is ChangeEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    "items" in value &&
    Array.isArray(value.items)
  )
}

export const CHANGELOG_INTRO =
  "What changed in the components, the registry and the docs, newest first. Update a component by running `shadcn add` for it again; there are no package versions to bump."

/** the dates of the entries, newest first */
export const newestFirst = (entries: Record<string, ChangeEntry>) =>
  Object.keys(entries).toSorted().toReversed()

/** The Changelog page as Markdown, for its table of contents and the search. */
export function changelogMarkdown(
  entries: Record<string, ChangeEntry>
): string {
  const days = newestFirst(entries)
  const body = days.map((day) => {
    const { title, items } = entries[day]
    return [
      `## ${formatDate(day)}`,
      ...(title ? [`**${title}**`] : []),
      items.map((i) => `- **${typeLabel(i.type)}** ${i.text}`).join("\n"),
    ].join("\n\n")
  })
  return ["# Changelog", CHANGELOG_INTRO, ...body].join("\n\n")
}
