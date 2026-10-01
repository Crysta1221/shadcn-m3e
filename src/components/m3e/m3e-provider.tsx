import * as React from "react"

import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "@/components/m3e/color-mode-provider"
import {
  M3ThemeProvider,
  type M3ThemeProviderProps,
} from "@/components/m3e/m3-theme-provider"

type M3eProviderProps = {
  children: React.ReactNode
  /** light / dark / system: props of `ColorModeProvider` */
  colorMode?: Omit<ColorModeProviderProps, "children">
  /** color scheme, motion and shape: props of `M3ThemeProvider` */
  theme?: Omit<M3ThemeProviderProps, "children">
}

/**
 * Everything M3E needs at the root, in one tag:
 *
 * ```tsx
 * <M3eProvider theme={{ defaultTheme: { source: { primary: "#006a60" } } }}>
 *   <App />
 * </M3eProvider>
 * ```
 *
 * It is `ColorModeProvider` (light / dark) around `M3ThemeProvider` (colors).
 * Use those two directly if you only want one of them.
 */
function M3eProvider({ children, colorMode, theme }: M3eProviderProps) {
  return (
    <ColorModeProvider {...colorMode}>
      <M3ThemeProvider {...theme}>{children}</M3ThemeProvider>
    </ColorModeProvider>
  )
}

export { M3eProvider }
export type { M3eProviderProps }
