import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { Resvg } from "@resvg/resvg-js"
import type { ReactElement } from "react"
import satori from "satori"

import appIcons from "../../../packages/m3e/src/components/icon-data.app"
import coreIcons from "../../../packages/m3e/src/components/icon-data"
import {
  CARD_PATHS,
  cardFile,
  pageCard,
  type Card,
} from "../src/docs/page-meta"

/**
 * The 1200x630 preview image of one page: its section, title and description
 * on the lavender card of og.html (the default image), with the page's icon
 * in a cookie shape. Drawn with satori (HTML-like objects to SVG) and
 * resvg (SVG to PNG), so it runs anywhere the site is built, Chrome or not.
 * Colors are the M3 baseline scheme, as in og.html.
 */
const W = 1200
const H = 630

const PRIMARY = "#6750a4"
const PRIMARY_CONTAINER = "#eaddff"
const SECONDARY_CONTAINER = "#e8def8"
const ON_SECONDARY_CONTAINER = "#1d192b"
const TERTIARY_CONTAINER = "#ffd8e4"
const ON_SURFACE = "#1d1b20"
const ON_SURFACE_VARIANT = "#49454f"

// the favicon, as in og.html
const LOGO =
  "M89.4282 11.7931C116.492 0.0387955 143.961 27.5077 132.207 54.5718L130.263 59.0465C126.675 67.3094 126.675 76.6907 130.263 84.9535L132.207 89.4282C143.961 116.492 116.492 143.961 89.4282 132.207L84.9535 130.263C76.6907 126.675 67.3093 126.675 59.0465 130.263L54.5718 132.207C27.5077 143.961 0.0387983 116.492 11.7931 89.4282L13.7366 84.9535C17.3253 76.6907 17.3252 67.3093 13.7366 59.0465L11.7931 54.5718C0.0387955 27.5077 27.5077 0.0387993 54.5718 11.7931L59.0465 13.7366C67.3094 17.3252 76.6907 17.3252 84.9535 13.7366L89.4282 11.7931Z"

type Node = ReactElement

const h = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
  props: Record<string, unknown> = {}
): Node => ({ type, props: { style, children, ...props }, key: null })

const dataUri = (svg: string) =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`

/** a smooth n-lobed outline, the family of M3E shapes (cookie, sunny, …) */
function lobes(n: number, depth: number): string {
  const pts: string[] = []
  for (let i = 0; i < 240; i++) {
    const t = (i / 240) * Math.PI * 2
    const r = 92 * (1 - depth + depth * (0.5 + 0.5 * Math.cos(n * t)))
    pts.push(`${(r * Math.cos(t)).toFixed(2)} ${(r * Math.sin(t)).toFixed(2)}`)
  }
  return `M${pts.join("L")}Z`
}

const shape = (n: number, depth: number, fill: string, inner = "") =>
  dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200"><path d="${lobes(n, depth)}" fill="${fill}"/>${inner}</svg>`
  )

/** the body of a bundled Material Symbols Rounded icon, filled */
function glyph(name: string): string | undefined {
  const base = name.replaceAll("_", "-")
  for (const key of [`${base}-rounded`, `${base}-outline-rounded`, base]) {
    for (const set of [coreIcons, appIcons]) {
      const body = set.icons[key]?.body
      if (body) return body
    }
  }
  return undefined
}

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
      backgroundImage: "linear-gradient(135deg, #faf3ff, #fef7ff 55%, #fdf0f6)",
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
          h("div", { display: "flex", alignItems: "center", gap: 14 }, [
            h("img", { width: 44, height: 44 }, undefined, {
              src: dataUri(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 144"><path fill="${PRIMARY}" d="${LOGO}"/></svg>`
              ),
            }),
            h(
              "div",
              { fontSize: 26, fontWeight: 500, color: ON_SURFACE_VARIANT },
              "shadcn M3E"
            ),
          ]),
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

function loadFonts(root: string) {
  const require = createRequire(path.join(root, "package.json"))
  const dir = path.join(
    path.dirname(require.resolve("@fontsource/roboto/package.json")),
    "files"
  )
  return ([400, 500] as const).map((weight) => ({
    name: "Roboto",
    weight,
    style: "normal" as const,
    data: fs.readFileSync(path.join(dir, `roboto-latin-${weight}-normal.woff`)),
  }))
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
