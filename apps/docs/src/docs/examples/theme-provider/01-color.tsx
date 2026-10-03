import { Button } from "@/components/m3e/button"
import { useM3Theme } from "@/components/m3e/m3-theme-provider"

const COLORS = [
  ["Purple", "#6750A4"],
  ["Teal", "#00796B"],
  ["Orange", "#E65100"],
  ["Rose", "#C2185B"],
  ["Blue", "#1565C0"],
] as const

export const meta = {
  title: "From a color",
  description:
    "setSeedColor(hex) regenerates the whole scheme, light and dark, and writes the CSS variables. This changes the theme of the entire site — reset it below.",
}

export default function Demo() {
  const { theme, setSeedColor, resetTheme } = useM3Theme()

  return (
    <>
      {COLORS.map(([name, hex]) => (
        <Button
          key={hex}
          variant={theme.source.primary === hex ? "filled" : "outlined"}
          onClick={() => setSeedColor(hex)}
        >
          <span
            aria-hidden
            className="size-3 rounded-full"
            style={{ background: hex }}
          />
          {name}
        </Button>
      ))}
      <label className="flex h-10 items-center gap-2 rounded-full border border-outline-variant px-4 text-label-large text-on-surface-variant">
        Custom
        <input
          type="color"
          aria-label="Custom seed color"
          value={theme.source.primary}
          onChange={(e) => setSeedColor(e.target.value)}
          className="size-6 cursor-pointer rounded-full border-0 bg-transparent p-0"
        />
      </label>
      <Button variant="text" onClick={resetTheme}>
        Reset
      </Button>
    </>
  )
}
