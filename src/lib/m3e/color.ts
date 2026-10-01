/**
 * Material 3 Expressive color schemes.
 *
 *  - `baseline`: the official static scheme (Compose Material3 tokens, with the
 *    expressive on-container tones), see `./baseline.ts`
 *  - everything else: dynamic schemes from a seed, built with Google's
 *    material-color-utilities. Like Compose's `MaterialExpressiveTheme`, light
 *    schemes take the on-*-container roles from tone 30 of their palette.
 *    The 2021 spec is the default (what Compose uses); the 2025 spec can be
 *    picked for the tonal-spot/expressive/vibrant/neutral variants.
 *
 * Key colors can come from a seed or from an image through node-vibrant (see
 * `./vibrant.ts`): the `image` variant uses the image's own swatches as the
 * secondary/tertiary/neutral palettes instead of deriving them from the seed.
 */
import {
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
  TonalPalette,
  Variant,
  argbFromHex,
  hexFromArgb,
  type DynamicColor,
} from "@material/material-color-utilities"

import { BASELINE } from "./baseline"

export const SCHEME_VARIANTS = [
  "baseline",
  "tonalSpot",
  "expressive",
  "vibrant",
  "neutral",
  "fidelity",
  "content",
  "rainbow",
  "fruitSalad",
  "monochrome",
  "image",
] as const
export type SchemeVariant = (typeof SCHEME_VARIANTS)[number]

const VARIANT: Record<Exclude<SchemeVariant, "image" | "baseline">, Variant> = {
  tonalSpot: Variant.TONAL_SPOT,
  expressive: Variant.EXPRESSIVE,
  vibrant: Variant.VIBRANT,
  neutral: Variant.NEUTRAL,
  fidelity: Variant.FIDELITY,
  content: Variant.CONTENT,
  rainbow: Variant.RAINBOW,
  fruitSalad: Variant.FRUIT_SALAD,
  monochrome: Variant.MONOCHROME,
}

export const CONTRAST_LEVELS = { standard: 0, medium: 0.5, high: 1 } as const
export type ContrastLevel = keyof typeof CONTRAST_LEVELS

/** membership check that narrows an unknown value to one of the unions */
export const isOneOf = <T extends string>(
  list: readonly T[],
  v: unknown
): v is T => typeof v === "string" && list.some((x) => x === v)

export const isContrastLevel = (v: unknown): v is ContrastLevel =>
  typeof v === "string" && v in CONTRAST_LEVELS

export const SPEC_VERSIONS = ["2021", "2025"] as const
export type SpecVersion = (typeof SPEC_VERSIONS)[number]

/** The baseline seed (M3's #6750A4). */
export const BASELINE_SEED = "#6750A4"

/** Key colors of a scheme. Only `primary` is required; the others are
 *  image swatches that the `image` variant turns into palettes directly. */
export type SchemeSource = {
  primary: string
  secondary?: string
  tertiary?: string
  neutral?: string
}

export type SchemeOptions = {
  source: SchemeSource
  variant?: SchemeVariant
  contrast?: ContrastLevel
  spec?: SpecVersion
  dark?: boolean
}

const mdc = new MaterialDynamicColors()

/** every role, keyed by its CSS name (`on-primary-container`) */
const ROLES: [string, DynamicColor][] = [
  ...mdc.allColors,
  mdc.surfaceVariant(),
  mdc.surfaceTint(),
  mdc.shadow(),
  mdc.scrim(),
].map((c) => [c.name.replaceAll("_", "-"), c])

export const COLOR_ROLES = ROLES.map(([name]) => name)
export type ColorScheme = Record<string, string>

const imagePalette = (hex: string | undefined, minChroma: number) => {
  if (!hex) return undefined
  const hct = Hct.fromInt(argbFromHex(hex))
  return TonalPalette.fromHueAndChroma(hct.hue, Math.max(hct.chroma, minChroma))
}

export function createDynamicScheme({
  source,
  variant = "tonalSpot",
  contrast = "standard",
  spec = "2021",
  dark = false,
}: SchemeOptions): DynamicScheme {
  const sourceColorHct = Hct.fromInt(argbFromHex(source.primary))
  const base = {
    sourceColorHct,
    contrastLevel: CONTRAST_LEVELS[contrast],
    isDark: dark,
    specVersion: spec,
  }
  if (variant !== "image") {
    const v = variant === "baseline" ? "tonalSpot" : variant
    return new DynamicScheme({ ...base, variant: VARIANT[v] })
  }
  // Image: tonal-spot roles, fed with the image's own swatches.
  const neutral = source.neutral
    ? Hct.fromInt(argbFromHex(source.neutral))
    : null
  return new DynamicScheme({
    ...base,
    variant: Variant.TONAL_SPOT,
    primaryPalette: TonalPalette.fromHueAndChroma(
      sourceColorHct.hue,
      Math.max(sourceColorHct.chroma, 36)
    ),
    secondaryPalette: imagePalette(source.secondary, 12),
    tertiaryPalette: imagePalette(source.tertiary, 24),
    neutralPalette: neutral
      ? TonalPalette.fromHueAndChroma(neutral.hue, 6)
      : undefined,
    neutralVariantPalette: neutral
      ? TonalPalette.fromHueAndChroma(neutral.hue, 10)
      : undefined,
  })
}

export function generateScheme(opts: SchemeOptions): ColorScheme {
  const { variant = "tonalSpot", contrast = "standard", dark = false } = opts
  if (variant === "baseline" && contrast === "standard") {
    return { ...BASELINE[dark ? "dark" : "light"] }
  }
  const scheme = createDynamicScheme(opts)
  const out: ColorScheme = Object.fromEntries(
    ROLES.map(([name, color]) => [name, hexFromArgb(color.getArgb(scheme))])
  )
  // M3 Expressive (Compose expressiveLightColorScheme): on-container = tone 30
  if (!dark && (opts.spec ?? "2021") === "2021" && contrast === "standard") {
    out["on-primary-container"] = hexFromArgb(scheme.primaryPalette.tone(30))
    out["on-secondary-container"] = hexFromArgb(
      scheme.secondaryPalette.tone(30)
    )
    out["on-tertiary-container"] = hexFromArgb(scheme.tertiaryPalette.tone(30))
    out["on-error-container"] = hexFromArgb(scheme.errorPalette.tone(30))
  }
  // 2021 has no *-dim roles
  for (const k of ["primary", "secondary", "tertiary", "error"]) {
    out[`${k}-dim`] ??= out[k]
  }
  return out
}

/** the tones M3 tools show for a tonal palette */
export const PALETTE_TONES = [
  0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100,
] as const

const paletteTones = (p: TonalPalette) =>
  PALETTE_TONES.map((t) => hexFromArgb(p.tone(t)))

export function schemePalettes(opts: SchemeOptions) {
  const s = createDynamicScheme(opts)
  return {
    primary: paletteTones(s.primaryPalette),
    secondary: paletteTones(s.secondaryPalette),
    tertiary: paletteTones(s.tertiaryPalette),
    neutral: paletteTones(s.neutralPalette),
    "neutral-variant": paletteTones(s.neutralVariantPalette),
    error: paletteTones(s.errorPalette),
  }
}

/* ---------- CSS ---------- */

export function schemeToCss(scheme: ColorScheme, indent = "  "): string {
  return Object.entries(scheme)
    .map(([role, hex]) => `${indent}--md-sys-color-${role}: ${hex};`)
    .join("\n")
}

/** `:root { ...light } .dark { ...dark }` for one theme */
export function themeCss(
  opts: Omit<SchemeOptions, "dark">,
  selectors = { light: ":root", dark: ".dark" }
): string {
  const light = generateScheme({ ...opts, dark: false })
  const dark = generateScheme({ ...opts, dark: true })
  return `${selectors.light} {\n${schemeToCss(light)}\n}\n\n${selectors.dark} {\n${schemeToCss(dark)}\n}\n`
}
