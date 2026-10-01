/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

/** What the user chose. `system` follows the OS. */
export type ColorMode = "light" | "dark" | "system"
/** What is on screen: `system` resolved to light or dark. */
export type ResolvedColorMode = "light" | "dark"

export type ColorModeProviderProps = {
  children: React.ReactNode
  /** the mode before the user chooses one (default `system`) */
  defaultMode?: ColorMode
  /** localStorage key of the chosen mode. index.html reads it before paint */
  storageKey?: string
  /** no transitions while the colors swap, so nothing animates through gray */
  disableTransitionOnChange?: boolean
  /** key that toggles light/dark outside text fields; `false` turns it off */
  toggleKey?: string | false
}

type ColorModeContextValue = {
  /** the chosen mode, possibly `system` */
  mode: ColorMode
  /** light or dark, whatever is on screen right now */
  resolvedMode: ResolvedColorMode
  setMode: (mode: ColorMode) => void
  /** light ↔ dark (from `system`, goes to the opposite of the OS) */
  toggleMode: () => void
}

const DARK_QUERY = "(prefers-color-scheme: dark)"
const MODES: readonly ColorMode[] = ["light", "dark", "system"]

const ColorModeContext = React.createContext<ColorModeContextValue | undefined>(
  undefined
)

const isColorMode = (value: string | null): value is ColorMode =>
  MODES.some((m) => m === value)

const systemMode = (): ResolvedColorMode =>
  window.matchMedia(DARK_QUERY).matches ? "dark" : "light"

const resolve = (mode: ColorMode): ResolvedColorMode =>
  mode === "system" ? systemMode() : mode

const opposite = (mode: ResolvedColorMode): ResolvedColorMode =>
  mode === "dark" ? "light" : "dark"

function readMode(key: string, fallback: ColorMode): ColorMode {
  try {
    const stored = localStorage.getItem(key)
    return isColorMode(stored) ? stored : fallback
  } catch {
    return fallback
  }
}

function writeMode(key: string, mode: ColorMode) {
  try {
    localStorage.setItem(key, mode)
  } catch {
    // storage may be blocked: the mode still applies
  }
}

/** Suspends CSS transitions; call the returned function to bring them back. */
function pauseTransitions() {
  const style = document.createElement("style")
  style.textContent =
    "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
  document.head.appendChild(style)

  return () => {
    // force a style flush, then lift the pause after the new colors painted
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => style.remove())
    })
  }
}

function isTextEntry(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest("input, textarea, select, [contenteditable='true']") !==
        null)
  )
}

/**
 * Light / dark / system. Puts `light` or `dark` on `<html>` as a class; every
 * M3 color role follows it. Which colors those roles have is the job of
 * `M3ThemeProvider`.
 */
export function ColorModeProvider({
  children,
  defaultMode = "system",
  storageKey = "color-mode",
  disableTransitionOnChange = true,
  toggleKey = "d",
}: ColorModeProviderProps) {
  const [mode, setModeState] = React.useState<ColorMode>(() =>
    readMode(storageKey, defaultMode)
  )
  const [resolvedMode, setResolvedMode] = React.useState<ResolvedColorMode>(
    () => resolve(mode)
  )

  const setMode = React.useCallback(
    (next: ColorMode) => {
      writeMode(storageKey, next)
      setModeState(next)
    },
    [storageKey]
  )

  const toggleMode = React.useCallback(
    () => setMode(opposite(resolve(mode))),
    [mode, setMode]
  )

  // put the resolved mode on <html>, and follow the OS while mode is `system`
  React.useEffect(() => {
    const apply = () => {
      const next = resolve(mode)
      const resume = disableTransitionOnChange ? pauseTransitions() : null
      const root = document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(next)
      setResolvedMode(next)
      resume?.()
    }
    apply()

    if (mode !== "system") return undefined
    const query = window.matchMedia(DARK_QUERY)
    query.addEventListener("change", apply)
    return () => query.removeEventListener("change", apply)
  }, [mode, disableTransitionOnChange])

  React.useEffect(() => {
    if (toggleKey === false) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
      if (isTextEntry(event.target)) return
      if (event.key.toLowerCase() !== toggleKey.toLowerCase()) return
      toggleMode()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [toggleKey, toggleMode])

  // another tab changed it
  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== localStorage || event.key !== storageKey) return
      setModeState(isColorMode(event.newValue) ? event.newValue : defaultMode)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [defaultMode, storageKey])

  const value = React.useMemo(
    () => ({ mode, resolvedMode, setMode, toggleMode }),
    [mode, resolvedMode, setMode, toggleMode]
  )

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  )
}

export function useColorMode() {
  const ctx = React.useContext(ColorModeContext)
  if (!ctx)
    throw new Error("useColorMode must be used within a ColorModeProvider")
  return ctx
}
