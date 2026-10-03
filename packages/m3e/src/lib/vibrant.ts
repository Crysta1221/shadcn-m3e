import { Vibrant } from "node-vibrant/browser"
import { Hct, argbFromHex } from "@material/material-color-utilities"

import type { SchemeSource } from "@/lib/m3e/color"

export const SWATCH_NAMES = [
  "Vibrant",
  "DarkVibrant",
  "LightVibrant",
  "Muted",
  "DarkMuted",
  "LightMuted",
] as const
export type SwatchName = (typeof SWATCH_NAMES)[number]

export type ImageSwatch = { name: SwatchName; hex: string; population: number }

/**
 * Anything that holds a picture, as it comes: a picked file, a dropped Blob, a
 * URL (also `data:` and SVG), or an element / bitmap you already have.
 */
export type ThemeImage =
  | File
  | Blob
  | string
  | HTMLImageElement
  | HTMLCanvasElement
  | ImageBitmap
  | ImageData

/** an image ready for node-vibrant, plus a URL to show it */
export type ResolvedImage = {
  /** what node-vibrant reads */
  src: string | HTMLImageElement
  /** a URL for an <img>; stays valid until `release()` */
  previewUrl: string
  /** frees the object URL made for a Blob or a canvas (no-op otherwise) */
  release: () => void
}

function canvasOf(image: ImageBitmap | ImageData) {
  const canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not available")
  if (image instanceof ImageData) ctx.putImageData(image, 0, 0)
  else ctx.drawImage(image, 0, 0)
  return canvas
}

function blobOf(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Couldn't read the canvas"))),
      "image/png"
    )
  )
}

/** Turns any `ThemeImage` into something node-vibrant can read. */
export async function resolveImage(image: ThemeImage): Promise<ResolvedImage> {
  if (typeof image === "string")
    return { src: image, previewUrl: image, release: () => {} }
  if (image instanceof HTMLImageElement)
    return {
      src: image,
      previewUrl: image.currentSrc || image.src,
      release: () => {},
    }
  const blob =
    image instanceof Blob
      ? image
      : await blobOf(
          image instanceof HTMLCanvasElement ? image : canvasOf(image)
        )
  const url = URL.createObjectURL(blob)
  return { src: url, previewUrl: url, release: () => URL.revokeObjectURL(url) }
}

/** the six swatches node-vibrant finds in an image (missing ones are left out) */
export async function extractSwatches(
  src: string | HTMLImageElement
): Promise<ImageSwatch[]> {
  const palette = await Vibrant.from(src).quality(3).getPalette()
  return SWATCH_NAMES.flatMap((name) => {
    const s = palette[name]
    return s
      ? [{ name, hex: s.hex.toUpperCase(), population: s.population }]
      : []
  })
}

const hue = (hex: string) => Hct.fromInt(argbFromHex(hex)).hue
const hueDistance = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

/**
 * Key colors for a scheme: the chosen swatch (Vibrant by default) is the seed,
 * Muted feeds secondary, the swatch whose hue is furthest from the seed feeds
 * tertiary, and DarkMuted tints the neutrals.
 */
export function sourceFromSwatches(
  swatches: ImageSwatch[],
  primary?: string
): SchemeSource | null {
  const by = (n: SwatchName) => swatches.find((s) => s.name === n)?.hex
  const seed =
    primary ??
    by("Vibrant") ??
    by("DarkVibrant") ??
    by("LightVibrant") ??
    by("Muted") ??
    swatches[0]?.hex
  if (!seed) return null
  const h = hue(seed)
  const tertiary = swatches
    .filter((s) => s.hex !== seed)
    .map((s) => ({ hex: s.hex, d: hueDistance(hue(s.hex), h) }))
    .toSorted((a, b) => b.d - a.d)[0]
  return {
    primary: seed,
    secondary: by("Muted") ?? by("LightMuted"),
    tertiary: tertiary && tertiary.d > 20 ? tertiary.hex : undefined,
    neutral: by("DarkMuted") ?? by("LightMuted"),
  }
}
