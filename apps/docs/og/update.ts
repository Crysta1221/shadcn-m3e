import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { Resvg } from "@resvg/resvg-js"
import satori from "satori"

import {
  BACKGROUND,
  brand,
  glyph,
  h,
  loadFonts,
  ON_PRIMARY_CONTAINER,
  ON_SECONDARY_CONTAINER,
  ON_SURFACE,
  ON_SURFACE_VARIANT,
  ON_TERTIARY_CONTAINER,
  PRIMARY,
  PRIMARY_CONTAINER,
  SECONDARY_CONTAINER,
  shape,
  TERTIARY_CONTAINER,
  type Node,
} from "./kit"
import {
  formatDate,
  isChangeEntry,
  typeLabel,
  type ChangeEntry,
  type ChangeItem,
} from "../src/docs/changelog-format"

/**
 * The announcement image of one changelog entry, 1200x675 (16:9, what X crops
 * to). It reuses the look of the page cards (card.ts): the lavender
 * background, the lobed shapes and the cookie holding a glyph. The date, which
 * is the file name, is the heading. The content is
 * `src/docs/changelog/YYYY-MM-DD.json`, the file the Changelog page is built
 * from (see changelog-format.ts); at most 5 items fit. Run
 * `bun run --cwd apps/docs gen:update <date>` (or a path to the JSON), which
 * writes `<date>.png` beside it.
 */
const W = 1200
const H = 675
const MAX_ITEMS = 5

// feat and fix get their own role colors; everything else is neutral
const TYPES: Record<string, { label: string; bg: string; fg: string }> = {
  feat: {
    label: typeLabel("feat"),
    bg: PRIMARY_CONTAINER,
    fg: ON_PRIMARY_CONTAINER,
  },
  fix: {
    label: typeLabel("fix"),
    bg: TERTIARY_CONTAINER,
    fg: ON_TERTIARY_CONTAINER,
  },
}
const typeStyle = (type: string) =>
  TYPES[type] ?? {
    label: typeLabel(type),
    bg: SECONDARY_CONTAINER,
    fg: ON_SECONDARY_CONTAINER,
  }

/** one 26px line in the 560px text column holds about 44 characters */
function fit(text: string, max = 44): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`
}

function row({ type, text }: ChangeItem): Node {
  const { label, bg, fg } = typeStyle(type)
  return h("div", { display: "flex", alignItems: "center", gap: 18 }, [
    h(
      "div",
      {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 84,
        height: 40,
        borderRadius: 20,
        fontSize: 21,
        fontWeight: 500,
        background: bg,
        color: fg,
      },
      label
    ),
    h("div", { fontSize: 29, color: ON_SURFACE }, fit(text)),
  ])
}

function layout(date: string, update: ChangeEntry): Node {
  const icon = glyph(update.icon ?? "check_circle")
  // the glyph is 24 units wide; 3.6 scales it to 86 of the 200-unit shape
  const cookie = shape(
    9,
    0.14,
    PRIMARY,
    icon
      ? `<g transform="translate(-43.2 -43.2) scale(3.6)" fill="#fff" color="#fff">${icon.replaceAll("currentColor", "#fff")}</g>`
      : ""
  )

  return h(
    "div",
    {
      position: "relative",
      display: "flex",
      width: W,
      height: H,
      overflow: "hidden",
      fontFamily: "Roboto",
      color: ON_SURFACE,
      backgroundImage: BACKGROUND,
    },
    [
      h(
        "img",
        {
          position: "absolute",
          left: 800,
          top: -170,
          width: 560,
          height: 560,
          opacity: 0.9,
        },
        undefined,
        { src: shape(9, 0.14, PRIMARY_CONTAINER) }
      ),
      h(
        "img",
        {
          position: "absolute",
          left: 950,
          top: 450,
          width: 400,
          height: 400,
          opacity: 0.85,
        },
        undefined,
        { src: shape(12, 0.12, TERTIARY_CONTAINER) }
      ),
      h(
        "img",
        { position: "absolute", left: 840, top: 175, width: 300, height: 300 },
        undefined,
        { src: cookie }
      ),
      h(
        "div",
        {
          position: "absolute",
          left: 72,
          top: 60,
          bottom: 60,
          width: 740,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
        [
          brand(),
          h("div", { display: "flex", flexDirection: "column", gap: 18 }, [
            h(
              "div",
              { fontSize: 28, fontWeight: 500, color: PRIMARY },
              "What's new"
            ),
            h(
              "div",
              {
                fontSize: 96,
                lineHeight: 1,
                fontWeight: 500,
                letterSpacing: "-0.02em",
              },
              formatDate(date)
            ),
            ...(update.title
              ? [
                  h(
                    "div",
                    { fontSize: 32, color: ON_SURFACE_VARIANT },
                    fit(update.title, 50)
                  ),
                ]
              : []),
            h(
              "div",
              {
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginTop: 12,
              },
              update.items.slice(0, MAX_ITEMS).map(row)
            ),
          ]),
        ]
      ),
    ]
  )
}

/** Render one changelog entry to PNG bytes. */
export async function renderUpdate(
  date: string,
  update: ChangeEntry,
  root: string
): Promise<Buffer> {
  const svg = await satori(layout(date, update), {
    width: W,
    height: H,
    fonts: loadFonts(root),
  })
  return new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng()
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const input = process.argv[2]
  if (!input) throw new Error("usage: gen:update <YYYY-MM-DD | path to .json>")
  const root = path.resolve(fileURLToPath(import.meta.url), "../..")
  const file = input.endsWith(".json")
    ? path.resolve(input)
    : path.join(root, "src/docs/changelog", `${input}.json`)
  const date = path.basename(file, ".json")
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new Error("the file name must be a date, YYYY-MM-DD.json")
  const entry: unknown = JSON.parse(fs.readFileSync(file, "utf8"))
  if (!isChangeEntry(entry)) throw new Error("the JSON needs an `items` array")
  if (entry.items.length > MAX_ITEMS)
    console.warn(`only the first ${MAX_ITEMS} items fit; the rest are dropped`)
  const out = file.replace(/\.json$/, ".png")
  fs.writeFileSync(out, await renderUpdate(date, entry, root))
  console.log(`wrote ${path.relative(process.cwd(), out)}`)
}
