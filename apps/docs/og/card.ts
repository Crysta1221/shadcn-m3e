import fs from "node:fs"
import path from "node:path"
import { Resvg } from "@resvg/resvg-js"
import satori from "satori"

import {
  CARD_PATHS,
  cardFile,
  pageCard,
  type Card,
} from "../src/docs/page-meta"
import {
  BACKGROUND,
  brand,
  glyph,
  h,
  loadFonts,
  ON_SECONDARY_CONTAINER,
  ON_SURFACE,
  ON_SURFACE_VARIANT,
  PRIMARY,
  PRIMARY_CONTAINER,
  SECONDARY_CONTAINER,
  shape,
  TERTIARY_CONTAINER,
  type Node,
} from "./kit"

/**
 * The 1200x630 preview image of one page: its section, title and description
 * on the lavender card of og.html (the default image), with the page's icon
 * in a cookie shape. Drawn with satori (HTML-like objects to SVG) and
 * resvg (SVG to PNG), so it runs anywhere the site is built, Chrome or not.
 * Colors are the M3 baseline scheme, as in og.html.
 */
const W = 1200
const H = 630

const headingSize = (text: string) =>
  text.length <= 9 ? 132 : text.length <= 13 ? 108 : 84

/** three lines of 32px text in the 700px column hold about 120 characters */
function fit(text: string, max = 120): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`
}

function chip(label: string): Node {
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      height: 44,
      padding: "0 22px",
      borderRadius: 22,
      fontSize: 22,
      fontWeight: 500,
      background: SECONDARY_CONTAINER,
      color: ON_SECONDARY_CONTAINER,
    },
    label
  )
}

function layout(card: Card): Node {
  const icon = glyph(card.icon)
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
          left: 760,
          top: -170,
          width: 560,
          height: 560,
          opacity: 0.9,
        },
        undefined,
        {
          src: shape(9, 0.14, PRIMARY_CONTAINER),
        }
      ),
      h(
        "img",
        {
          position: "absolute",
          left: 930,
          top: 400,
          width: 400,
          height: 400,
          opacity: 0.85,
        },
        undefined,
        {
          src: shape(12, 0.12, TERTIARY_CONTAINER),
        }
      ),
      h(
        "img",
        { position: "absolute", left: 790, top: 150, width: 330, height: 330 },
        undefined,
        {
          src: cookie,
        }
      ),
      h(
        "div",
        {
          position: "absolute",
          left: 72,
          top: 60,
          bottom: 60,
          width: 700,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
        [
          brand(),
          h("div", { display: "flex", flexDirection: "column", gap: 20 }, [
            ...(card.eyebrow
              ? [
                  h(
                    "div",
                    { fontSize: 28, fontWeight: 500, color: PRIMARY },
                    card.eyebrow
                  ),
                ]
              : []),
            h(
              "div",
              {
                fontSize: headingSize(card.heading),
                lineHeight: 1.02,
                fontWeight: 500,
                letterSpacing: "-0.02em",
              },
              card.heading
            ),
            h(
              "div",
              {
                fontSize: 32,
                lineHeight: 1.3,
                color: ON_SURFACE_VARIANT,
              },
              fit(card.description)
            ),
          ]),
          h(
            "div",
            { display: "flex", gap: 10, height: 44 },
            card.chips.map(chip)
          ),
        ]
      ),
    ]
  )
}

/** Render one page's card to PNG bytes, or undefined if the page has none. */
export async function renderCard(
  pathname: string,
  fonts: ReturnType<typeof loadFonts>
): Promise<Buffer | undefined> {
  const card = pageCard(pathname)
  if (!card) return undefined
  const svg = await satori(layout(card), {
    width: W,
    height: H,
    fonts,
  })
  return new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng()
}

/** Write every page's card into `<outDir>/og/…`. */
export async function writeCards(root: string, outDir: string) {
  const fonts = loadFonts(root)
  await Promise.all(
    CARD_PATHS.map(async (pathname) => {
      const png = await renderCard(pathname, fonts)
      if (!png) return
      const file = path.join(outDir, ...cardFile(pathname).split("/"))
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, png)
    })
  )
  return CARD_PATHS.length
}
