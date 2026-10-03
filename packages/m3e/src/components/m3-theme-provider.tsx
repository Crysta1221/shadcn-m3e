/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

import {
  BASELINE_SEED,
  CONTRAST_LEVELS,
  SCHEME_VARIANTS,
  SPEC_VERSIONS,
  themeCss,
  type ContrastLevel,
  type SchemeSource,
  type SchemeVariant,
  type SpecVersion,
} from "@/lib/m3e/color"

export type MotionScheme = "expressive" | "standard"

export type M3Theme = {
  source: SchemeSource
  variant: SchemeVariant
  contrast: ContrastLevel
  /** color spec for dynamic schemes (Compose uses 2021) */
  spec: SpecVersion
  motion: MotionScheme
  /** multiplies every corner radius: 0.35 ≈ square, 1 = M3, 1.6 ≈ round */
  shapeScale: number
}

export const DEFAULT_M3_THEME: M3Theme = {
  source: { primary: BASELINE_SEED },
  variant: "baseline",
  contrast: "standard",
  spec: "2021",
  motion: "expressive",
  shapeScale: 1,
}

type M3ThemeContextValue = {
  theme: M3Theme
  /** change any part of the theme; the CSS variables follow at once */
  updateTheme: (patch: Partial<M3Theme>) => void
  /**
   * Theme from one seed color (`#RRGGBB`). Keeps the current variant unless it
   * is `baseline` or `image`, which need more than a seed: those become
   * `tonalSpot`.
   */
  setSeedColor: (hex: string, patch?: Partial<M3Theme>) => void
  /** back to `defaultTheme` and forget the saved one */
  resetTheme: () => void
  /** the CSS this theme writes, ready to paste into a stylesheet */
  css: string
}

const M3ThemeContext = React.createContext<M3ThemeContextValue | undefined>(
  undefined
)

const STYLE_ID = "m3-theme"
const HEX = /^#[0-9a-f]{6}$/i

function load(key: string, fallback: M3Theme, persist: boolean): M3Theme {
  if (!persist) return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null) return fallback
    const t: M3Theme = { ...fallback, ...parsed }
    if (!SCHEME_VARIANTS.includes(t.variant)) t.variant = fallback.variant
    if (!SPEC_VERSIONS.includes(t.spec)) t.spec = fallback.spec
    if (!(t.contrast in CONTRAST_LEVELS)) t.contrast = fallback.contrast
    if (typeof t.source?.primary !== "string" || !HEX.test(t.source.primary))
      t.source = fallback.source
    return t
  } catch {
    return fallback
  }
}

export type M3ThemeProviderProps = {
  children: React.ReactNode
  /** the theme before the user changes anything (and after `resetTheme`) */
  defaultTheme?: Partial<M3Theme>
  /** localStorage key for the chosen theme */
  storageKey?: string
  /** remember the chosen theme in localStorage (default true) */
  persist?: boolean
}

/**
 * Generates the M3 color scheme (light + dark) for the current theme and writes
 * it to a `<style>` tag, plus the motion scheme and shape scale on `<html>`.
 * Light/dark itself is switched by the `.dark` class (see ColorModeProvider).
 *
 * The style tag is written before the browser paints, so a saved theme does
 * not flash the baseline colors first.
 */
export function M3ThemeProvider({
  children,
  defaultTheme,
  storageKey = "m3-theme",
  persist = true,
}: M3ThemeProviderProps) {
  // the caller's object may be a new one every render: only its content counts
  const defaults = React.useMemo<M3Theme>(
    () => ({ ...DEFAULT_M3_THEME, ...defaultTheme }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(defaultTheme)]
  )
  const [theme, setThemeState] = React.useState<M3Theme>(() =>
    load(storageKey, defaults, persist)
  )

  const css = React.useMemo(
    () =>
      themeCss({
        source: theme.source,
        variant: theme.variant,
        contrast: theme.contrast,
        spec: theme.spec,
      }),
    [theme.source, theme.variant, theme.contrast, theme.spec]
  )

  React.useLayoutEffect(() => {
    let style = document.getElementById(STYLE_ID)
    if (!style) {
      style = document.createElement("style")
      style.id = STYLE_ID
      document.head.appendChild(style)
    }
    style.textContent = css
  }, [css])

  React.useLayoutEffect(() => {
    const root = document.documentElement
    root.dataset.motion = theme.motion
    root.style.setProperty("--md-sys-shape-scale", String(theme.shapeScale))
  }, [theme.motion, theme.shapeScale])

  const save = React.useCallback(
    (next: M3Theme) => {
      if (!persist) return
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        // storage may be full or blocked: the theme still applies
      }
    },
    [storageKey, persist]
  )

  const updateTheme = React.useCallback(
    (patch: Partial<M3Theme>) =>
      setThemeState((prev) => {
        const next = { ...prev, ...patch }
        save(next)
        return next
      }),
    [save]
  )

  const setSeedColor = React.useCallback(
    (hex: string, patch?: Partial<M3Theme>) => {
      if (!HEX.test(hex)) return
      setThemeState((prev) => {
        const variant =
          prev.variant === "baseline" || prev.variant === "image"
            ? "tonalSpot"
            : prev.variant
        const next = { ...prev, source: { primary: hex }, variant, ...patch }
        save(next)
        return next
      })
    },
    [save]
  )

  const resetTheme = React.useCallback(() => {
    if (persist) {
      try {
        localStorage.removeItem(storageKey)
      } catch {
        // see save
      }
    }
    setThemeState(defaults)
  }, [storageKey, persist, defaults])

  const value = React.useMemo(
    () => ({ theme, updateTheme, setSeedColor, resetTheme, css }),
    [theme, updateTheme, setSeedColor, resetTheme, css]
  )

  return (
    <M3ThemeContext.Provider value={value}>{children}</M3ThemeContext.Provider>
  )
}

export function useM3Theme() {
  const ctx = React.useContext(M3ThemeContext)
  if (!ctx) throw new Error("useM3Theme must be used within an M3ThemeProvider")
  return ctx
}
