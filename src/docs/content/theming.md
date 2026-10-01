# Themes

M3E colors are generated at runtime. Give the provider a color code or an image and it writes the whole scheme — light and dark, 30-odd roles — as CSS variables. Everything that uses a color role (`bg-primary`, `text-on-surface`…) follows at once, with no rebuild.

Two things are set separately, each with its own provider and hook:

| Setting        | Provider            | Hook             | Job                                                           |
| -------------- | ------------------- | ---------------- | ------------------------------------------------------------- |
| **Color mode** | `ColorModeProvider` | `useColorMode()` | Light, dark or system. Toggles the `.dark` class on `<html>`. |
| **Theme**      | `M3ThemeProvider`   | `useM3Theme()`   | Generates the color scheme, motion scheme and shape scale.    |

`M3eProvider` is both in one tag.

## Set up

Wrap the app once (see [Installation](/docs/installation)):

```tsx
<M3eProvider>
  <App />
</M3eProvider>
```

Start from your own theme instead of the baseline purple, or from a fixed mode. `colorMode` and `theme` take the props of the two providers:

```tsx
<M3eProvider
  colorMode={{ defaultMode: "light" }}
  theme={{
    defaultTheme: { source: { primary: "#006a60" }, variant: "tonalSpot" },
  }}
>
```

## Light and dark

```tsx
import { useColorMode } from "@/components/m3e/color-mode-provider"

function ModeButton() {
  const { mode, resolvedMode, setMode, toggleMode } = useColorMode()
  return <button onClick={toggleMode}>Now {resolvedMode}</button>
}
```

`mode` is what the user chose (`light`, `dark` or `system`); `resolvedMode` is what is on screen. `setMode("system")` follows the OS. The choice is saved under `color-mode`, and pressing <kbd>D</kbd> outside a text field toggles it (`toggleKey={false}` turns that off).

To avoid a flash of the wrong mode, `index.html` applies it before the first paint with a small inline script that reads the same `color-mode` key.

## From a color code

```tsx
import { useM3Theme } from "@/components/m3e/m3-theme-provider"

function Picker() {
  const { setSeedColor, resetTheme } = useM3Theme()
  return (
    <>
      <input type="color" onChange={(e) => setSeedColor(e.target.value)} />
      <button onClick={resetTheme}>Reset</button>
    </>
  )
}
```

`setSeedColor("#RRGGBB")` derives every role from that one color. It keeps the current variant, except `baseline` and `image`, which need more than a seed and become `tonalSpot`. Pass a second argument to change more in the same step: `setSeedColor("#00796B", { contrast: "high" })`.

## From an image

The image variant picks swatches from the picture with node-vibrant and uses them as the primary, secondary, tertiary and neutral palettes, so the scheme looks like the picture.

```bash
npx shadcn@latest add @m3e/use-image-theme
```

```tsx
import { useImageTheme } from "@/components/m3e/use-image-theme"

function Upload() {
  const { applyImage, preview, loading, error } = useImageTheme()
  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => e.target.files?.[0] && applyImage(e.target.files[0])}
    />
  )
}
```

`applyImage` takes the image as you have it, with nothing to convert first:

| You have                                 | Pass it as                        |
| ---------------------------------------- | --------------------------------- |
| A picked or dropped file                 | the `File` / `Blob`               |
| A URL (also `data:` and SVG)             | the string                        |
| An `<img>` already on the page           | the element, e.g. a `ref.current` |
| A `<canvas>`, `ImageBitmap`, `ImageData` | the object                        |

So an image shown in a dialog can be passed straight from its `<img>`:

```tsx
<img ref={img} src={cover} alt="" />
<Button onClick={() => applyImage(img.current!)}>Use these colors</Button>
```

It returns `{ swatches, source }`, or `null` after setting `error`. Besides that, the hook gives you:

- `preview` — a URL to show the image again. It is freed when the next image replaces it or the component unmounts.
- `swatches` — what was found. `pickSwatch(hex)` re-seeds the theme from one of them, and `applyImage(image, { primary: "#RRGGBB" })` does the same in one step.

For a URL on another origin, the server must send CORS headers, or the browser will not let the pixels be read.

## Any part of the theme

`updateTheme` changes any field and leaves the rest. The CSS updates immediately and the choice is saved.

```tsx
const { theme, updateTheme } = useM3Theme()

updateTheme({ variant: "expressive", contrast: "medium" })
updateTheme({ motion: "standard", shapeScale: 0.6 })
```

| Field        | Values                                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`     | `{ primary, secondary?, tertiary?, neutral? }` — hex colors. Only `primary` is required.                                                     |
| `variant`    | `baseline` · `tonalSpot` · `expressive` · `vibrant` · `neutral` · `fidelity` · `content` · `rainbow` · `fruitSalad` · `monochrome` · `image` |
| `contrast`   | `standard` · `medium` · `high`                                                                                                               |
| `spec`       | `2021` (what Compose uses) · `2025`                                                                                                          |
| `motion`     | `expressive` · `standard`, see [Motion](/docs/motion)                                                                                        |
| `shapeScale` | Multiplies every corner radius. `1` is M3, `0.35` is nearly square, `1.6` is very round.                                                     |

`baseline` is the official static M3 scheme and ignores the source color. Every other variant is computed from it.

## Provider props

`M3ThemeProvider`:

| Prop           | Default      |                                                                                 |
| -------------- | ------------ | ------------------------------------------------------------------------------- |
| `defaultTheme` | baseline     | The theme before the user picks one, and what `resetTheme` returns to.          |
| `storageKey`   | `"m3-theme"` | `localStorage` key of the saved theme.                                          |
| `persist`      | `true`       | Save the chosen theme. Set `false` to start from `defaultTheme` on every visit. |

The scheme is written before the first paint, so a saved theme never flashes the baseline colors.

`ColorModeProvider`:

| Prop                        | Default        |                                                      |
| --------------------------- | -------------- | ---------------------------------------------------- |
| `defaultMode`               | `"system"`     | The mode before the user picks one.                  |
| `storageKey`                | `"color-mode"` | `localStorage` key of the chosen mode.               |
| `disableTransitionOnChange` | `true`         | Pause transitions while the colors swap.             |
| `toggleKey`                 | `"d"`          | Key that toggles light / dark. `false` turns it off. |

## A theme for one part of the page

`M3ThemeScope` gives a subtree its own scheme, independent of the page: a card colored by an album cover, or a preview of a theme before applying it.

```tsx
import { M3ThemeScope } from "@/components/m3e/m3-theme-scope"

;<M3ThemeScope source={{ primary: "#E65100" }} className="rounded-lg p-4">
  <Button>Orange, whatever the page theme is</Button>
</M3ThemeScope>
```

Light and dark still follow the page. Anything that uses the M3 roles picks the scope up; the shadcn aliases (`bg-background`, `bg-muted`) stay on the page theme.

## Using the colors

Colors are CSS variables and Tailwind classes; see [Color](/docs/color) for the roles.

```css
.banner {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}
```

To compute a scheme without applying it — a swatch list, an email template — call the generator directly:

```ts
import { generateScheme, schemePalettes } from "@/lib/m3e/color"

const light = generateScheme({
  source: { primary: "#6750A4" },
  variant: "tonalSpot",
})
light["primary-container"] // "#eaddff"

const dark = generateScheme({ source: { primary: "#6750A4" }, dark: true })
const tones = schemePalettes({ source: { primary: "#6750A4" } }) // tonal palettes, tone 0…100
```

## Freezing a theme

If the theme never changes at runtime, generate the CSS once and put it in your stylesheet. `css` from `useM3Theme()`, or the copy button on the [Theme page](/theme), is a `:root` block for light and a `.dark` block for dark:

```css
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  /* … */
}
.dark {
  --md-sys-color-primary: #d0bcff;
  /* … */
}
```

Frozen CSS also gives server-rendered pages the right colors on the first byte. Keep `M3ThemeProvider` if you still want the motion and shape settings.

## Try it

- [Theme page](/theme) — pick a color or an image and watch the whole site change.
- [Theme provider](/components/theme-provider) — live examples and the full API.
