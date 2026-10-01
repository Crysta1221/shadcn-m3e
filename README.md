<p align="center">
  <img src="docs/assets/hero.png" alt="shadcn M3E — Material 3 Expressive for shadcn/ui, in light and dark" width="100%">
</p>

<p align="center">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61dafb.svg">
  <img alt="Tailwind CSS v4" src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg">
  <a href="https://shadcn-m3e.crystaworld.dev"><img alt="Docs" src="https://img.shields.io/badge/docs-shadcn--m3e.crystaworld.dev-6750a4.svg"></a>
</p>

# shadcn M3E

**Material 3 Expressive for shadcn/ui** — React 19 · Tailwind CSS v4 · Base UI · TanStack Router

shadcn M3E re-creates the shadcn/ui components with the sizes, shapes, colors, motion and typography of Material 3 Expressive (M3E).
Import from `@/components/m3e/*` instead of `@/components/ui/*` and `<Button>` and friends come out looking and moving like M3E, with nothing else to set up. As with shadcn, the code is copied into your project, so you can change anything you like.

**Docs:** https://shadcn-m3e.crystaworld.dev

## Features

- **Drop-in** — the same API as shadcn, in M3E style. No configuration.
- **Built from the source tokens** — sizes, shapes, colors and motion come from Google's Compose Material3 tokens. Ripple and press behavior follow Material Web and [matraic/m3e](https://github.com/matraic/m3e).
- **M3E-only components** — navigation rail, toolbars, FAB menu, carousel, loading indicator and more (see [below](#m3e-only-components)).
- **Dynamic color** — generate a scheme from a seed color or an image and swap the CSS variables at runtime. Light, dark and contrast levels included.
- **Bundled icons** — Material Symbols Rounded ships with the project and never calls an external API at runtime. Only the icons you use are bundled.
- **Distributed as a shadcn registry** — add only what you need with `shadcn add @m3e/<name>`.
- **Docs site included** — 75 component pages with live demos, the code behind each demo, and props tables.

## Usage

```tsx
import { Button } from "@/components/m3e/button"

<Button>Filled</Button>
<Button variant="tonal" size="lg" shape="square">Tonal</Button>
```

### Add to an existing project (shadcn registry)

Register the registry in `components.json`:

```json
{ "registries": { "@m3e": "https://shadcn-m3e.crystaworld.dev/r/{name}.json" } }
```

Then add components:

```bash
npx shadcn@latest add @m3e/base               # styles, cn, theme, icon (first time only)
npx shadcn@latest add @m3e/button @m3e/card   # just what you need
npx shadcn@latest add @m3e/all                # everything
npx shadcn@latest add @m3e/use-image-theme    # theme from an image (node-vibrant)
```

Dependencies (npm packages, other registry items, icons) are worked out automatically from each source file's imports. Every component page (`/components/<slug>`) lists its install command, dependencies, icons and where the files land. See `/docs/registry` for details.

## M3E-only components

Navigation bar / rail, App bar, Floating and Docked toolbar, FAB / Extended FAB / FAB menu, Split button, Chips, Search, Carousel (multi-browse / hero / uncontained), Time picker, Date picker (docked / modal / range / input), Side sheet (standard / detached; modal is a Sheet), Loading indicator, Circular progress (flat / wavy), Text field, Notification badge, and Snackbar (`toast()` API, shown one at a time from a queue).

## Theming

```tsx
const { setSeedColor } = useM3Theme()
setSeedColor("#6750A4")

const { applyImage } = useImageTheme()
await applyImage(file) // File / Blob / URL / <img> / <canvas> / ImageBitmap
```

- The color scheme lives in `M3ThemeProvider` / `useM3Theme()`; light and dark live in `ColorModeProvider` / `useColorMode()`. `M3eProvider` sets up both at once.
- `M3ThemeScope` gives one region of the page its own theme.
- `/theme` builds a scheme from a color or an image and lets you copy the CSS.

More in `/docs/theming`.

## Icons

Material Symbols Rounded is bundled. The icons your code uses are written to `icon-data.app.ts`.

```bash
bun run gen:icons    # pick up the icons used in the source and update icon-data*.ts
bun run check:icons  # verify they exist and nothing is stale (read-only, for CI)
```

## Development

This project uses [bun](https://bun.sh) (`devEngines` pins 1.4.2).

```bash
bun install
bun run dev
```

That opens the docs site:

| Page          | What's there                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `/docs`       | Guides: introduction, installation, usage; Color, Theming, Shape, Typography, Elevation, Motion, State layers, Icons; migrating from shadcn/ui |
| `/components` | Component index. Each page has a description, imports, live demos with code, and a props table                                                |
| `/showcase`   | One page with everything, for eyeballing                                                                                                      |
| `/theme`      | Theme generator                                                                                                                               |

### Scripts

```bash
bun run dev             # dev server
bun run build           # type-check + build
bun run preview         # preview the build
bun run typecheck       # type-check only
bun run lint            # oxlint
bun run format          # oxfmt
bun run gen:tokens      # regenerate src/styles/m3e.generated.css
bun run registry:build  # generate public/r and src/docs/registry-meta.generated.ts
bun run gen:icons       # update the bundled icons
bun run check:icons     # verify icons exist and are up to date
```

`registry:build` runs automatically before `dev` and `build`.

### Project layout

| Path                 | What's there                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------- |
| `src/components/m3e` | shadcn components restyled as M3E, plus M3E components shadcn doesn't have                   |
| `src/components/ui`  | Stock shadcn (output of `add --all`). Reference only; excluded from type-check and lint      |
| `src/lib/m3e`        | Color generation (material-color-utilities), image extraction (node-vibrant), shape morphing |
| `src/styles`         | Design tokens (color, shape, type, elevation, motion) and Tailwind utilities                 |
| `src/docs`           | The docs site: guide Markdown, component data and demos                                      |
| `scripts`            | Token generation, registry build, icon bundling                                              |
| `public/r`           | The shadcn registry (output of `registry:build`; not tracked in git)                         |
| `videos`             | Intro video (Remotion). See [videos/README.md](videos/README.md)                             |

### Writing docs

- **Guides** — write `src/docs/content/<slug>.md` and list it in `src/docs/outline.ts`. Navigation, prev/next links and the table of contents are generated; code blocks are highlighted with Shiki.
- **Component pages** — descriptions, imports and props go in `src/docs/data/*.ts`. Demos go in `src/docs/examples/<slug>/<number>-<name>.tsx`: `export default` the component and add `export const meta = { title, description }`. The file's contents are shown verbatim as the demo's code, so what you see and what you copy never drift apart.

## Credits

### Based on (code or values ported or referenced)

| What                                                       | Source                                                                                                                                                                                | License          |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Sizes, shapes, colors, type, motion; per-component specs   | Tokens and implementation of [Compose Material3](https://developer.android.com/jetpack/androidx/releases/compose-material3)                                                          | Apache-2.0       |
| Ripple and press state (`data-press`)                      | `md-ripple` from [Material Web](https://github.com/material-components/material-web); `PressedController` from [matraic/m3e](https://github.com/matraic/m3e)                          | Apache-2.0 / MIT |
| Shape library and morphing                                 | `@m3e/shape` from matraic/m3e (the shapes are © Google LLC)                                                                                                                           | MIT              |
| Circular / Linear progress, Button group                   | matraic/m3e; Compose's `CircularProgressIndicator` / `ButtonGroup`                                                                                                                    | MIT / Apache-2.0 |
| Loading indicator                                          | [lnkiai/m3e-canvas](https://github.com/lnkiai/m3e-canvas) (originally [material-components-android](https://github.com/material-components/material-components-android))             | MIT / Apache-2.0 |
| Dynamic color                                              | [@material/material-color-utilities](https://github.com/material-foundation/material-color-utilities)                                                                                 | Apache-2.0       |

Full attribution is in the header comment of each file and in [NOTICE](NOTICE).

### Inspired by (ideas and usage referenced)

- [Material Design 3 / Material 3 Expressive](https://m3.material.io) — the guidelines; for example, the Snackbar's "one at a time" and "stays while it has an action".
- [shadcn/ui](https://ui.shadcn.com) — the shape of the API, the copy-the-code approach, and distribution through a registry.

### Built with

[shadcn/ui](https://ui.shadcn.com) (MIT) · [Base UI](https://base-ui.com) (MIT) · [Tailwind CSS](https://tailwindcss.com) (MIT) · [TanStack Router](https://tanstack.com/router) (MIT) · [Embla Carousel](https://www.embla-carousel.com) (MIT) · [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant) (MIT) · [Shiki](https://shiki.style) (MIT) · [Material Symbols Rounded](https://fonts.google.com/icons) (Apache-2.0, via Iconify) · [Roboto Flex](https://fonts.google.com/specimen/Roboto+Flex) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/) (OFL-1.1, via Fontsource)

Material Design is a trademark of Google LLC. This project is not affiliated with or endorsed by Google or shadcn/ui.

## License

[MIT](LICENSE) © 2026 Crysta1221
