/** Helpers shared by the Markdown renderer and the table of contents */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")

/** `##` and `###` headings of a Markdown source, for the table of contents */
export function headingsOf(source: string) {
  const out: { level: 2 | 3; text: string; id: string }[] = []
  let fenced = false
  for (const line of source.split("\n")) {
    if (line.startsWith("```")) fenced = !fenced
    if (fenced) continue
    const m = /^(##|###)\s+(.*)$/.exec(line)
    if (m) {
      const text = m[2].replace(/`/g, "").trim()
      out.push({ level: m[1] === "##" ? 2 : 3, text, id: slugify(text) })
    }
  }
  return out
}
