import * as React from "react"

import { themeCss, type SchemeOptions } from "@/lib/m3e/color"

type M3ThemeScopeProps = React.ComponentProps<"div"> &
  Pick<SchemeOptions, "source" | "variant" | "contrast" | "spec">

/**
 * A subtree with its own color scheme, independent of the page theme: a card
 * tinted by an album cover, a preview of a theme before applying it.
 *
 * Light or dark follows the page (the `.dark` class). Everything that uses the
 * M3 roles (`bg-primary-container`, `text-on-surface`…) picks the scope's
 * colors up; the shadcn aliases (`bg-background`, `bg-muted`) stay on the
 * page theme.
 */
function M3ThemeScope({
  source,
  variant = "tonalSpot",
  contrast,
  spec,
  className,
  children,
  ...props
}: M3ThemeScopeProps) {
  const id = "m3-scope-" + React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const css = React.useMemo(
    () =>
      themeCss(
        { source, variant, contrast, spec },
        { light: `.${id}`, dark: `.dark .${id}` }
      ),
    [id, source, variant, contrast, spec]
  )

  return (
    <div
      data-slot="theme-scope"
      className={[id, "bg-surface text-on-surface", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <style>{css}</style>
      {children}
    </div>
  )
}

export { M3ThemeScope }
