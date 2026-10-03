import {
  Icon as Iconify,
  type IconProps as IconifyIconProps,
} from "@iconify/react/offline"

import { cn } from "@/lib/m3e/cn"

import { registerIcons, warnIfMissing } from "./icon-registry"

/**
 * Material Symbols Rounded (`material-symbols:*`), from the bundled icon data.
 * Names use Material's ligature spelling ("arrow_back") or Iconify's
 * ("arrow-back"). Unfilled icons are `*-outline-rounded`, filled `*-rounded`.
 */
export function symbolName(name: string, filled: boolean) {
  const base = name.replaceAll("_", "-")
  const icon = `material-symbols:${base}${filled ? "" : "-outline"}-rounded`
  warnIfMissing(icon)
  return icon
}

type IconProps = Omit<IconifyIconProps, "icon" | "children" | "fill"> & {
  /** Material Symbols name, e.g. "home", "arrow_back" */
  name: string
  /**
   * true: filled glyph. "auto": outlined, filled while the surrounding control
   * is selected (aria-pressed / data-pressed / aria-selected / data-active /
   * aria-current) — M3 fills icons of selected items.
   */
  fill?: boolean | "auto"
  /** px, defaults to 24 */
  size?: number
}

function Icon({
  name,
  fill = false,
  size = 24,
  className,
  ...props
}: IconProps) {
  const common = {
    "aria-hidden": true,
    "data-slot": "icon",
    width: size,
    height: size,
    ...props,
  }
  if (fill === "auto") {
    return (
      <span
        data-slot="icon"
        className={cn(
          "m3-icon-auto inline-flex shrink-0 items-center justify-center align-middle",
          className
        )}
        style={{ width: size, height: size }}
      >
        <Iconify
          icon={symbolName(name, false)}
          {...common}
          className="m3-icon-outline"
        />
        <Iconify
          icon={symbolName(name, true)}
          {...common}
          className="m3-icon-filled"
        />
      </span>
    )
  }
  return (
    <Iconify
      icon={symbolName(name, fill)}
      {...common}
      className={cn("inline-block shrink-0 align-middle", className)}
    />
  )
}

export { Icon, registerIcons }
