# Installation

shadcn M3E is distributed as a **shadcn registry**. Like shadcn/ui, the components are copied into your project as source, and you own them.

## Requirements

- React 19
- Tailwind CSS v4
- A project set up with the shadcn CLI (`components.json` exists) and an `@/` alias to your source folder

```bash
npx shadcn@latest init -b base -p maia
```

`-b base` selects Base UI as the primitive library, `-p maia` the Maia preset the M3E styles were derived from.

## 1. Add the registry

Register the `@m3e` namespace in `components.json`:

```json
{
  "registries": {
    "@m3e": "{{origin}}/r/{name}.json"
  }
}
```

## 2. Install the base

Once per project:

```bash
npx shadcn@latest add @m3e/base
```

This adds the pieces every component builds on:

| Item          | What you get                                                                     |
| ------------- | -------------------------------------------------------------------------------- |
| `@m3e/styles` | Design tokens and Tailwind utilities (`lib/m3e/m3e.css`)                         |
| `@m3e/cn`     | `cn()` that knows the M3 type scale (`lib/m3e/cn.ts`)                            |
| `@m3e/theme`  | `M3eProvider`: light / dark (`ColorModeProvider`) and colors (`M3ThemeProvider`) |
| `@m3e/icon`   | `Icon` with the bundled Material Symbols, and `scripts/icons.mjs`                |

## 3. Import the styles

In your main CSS file, after Tailwind. The path is from that file to `lib/m3e/m3e.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/roboto-flex";
@import "@fontsource-variable/jetbrains-mono";
@import "./lib/m3e/m3e.css";
```

## 4. Add the providers

```tsx
import { M3eProvider } from "@/components/m3e/m3e-provider"

createRoot(document.getElementById("root")!).render(
  <M3eProvider>
    <App />
  </M3eProvider>
)
```

- `M3eProvider` is two providers in one tag: `ColorModeProvider` switches light / dark / system with the `.dark` class, and `M3ThemeProvider` generates the color scheme. See [Themes](/docs/theming).

Some components need a provider of their own, and their pages say so: `TooltipProvider` for tooltips, `Toaster` for snackbars.

## 5. Add components

Every component page starts with its install command. For example:

```bash
npx shadcn@latest add @m3e/button @m3e/card
```

Dependencies come along: `button` also installs `ripple`, and the npm packages it imports. To take everything:

```bash
npx shadcn@latest add @m3e/all
```

Themes from an image use node-vibrant, so they are opt-in:

```bash
npx shadcn@latest add @m3e/use-image-theme
```

## 6. Icons

Add the two scripts to `package.json`:

```json
{
  "scripts": {
    "gen:icons": "node scripts/icons.mjs",
    "check:icons": "node scripts/icons.mjs --check"
  }
}
```

Whenever you use a new icon, run `gen:icons`. See [Icons](/docs/icons).

## Where files go

| In the registry     | In your project                              |
| ------------------- | -------------------------------------------- |
| `@components/m3e/…` | `components/m3e/…` (your `components` alias) |
| `@lib/m3e/…`        | `lib/m3e/…` (your `lib` alias)               |
| `@hooks/…`          | `hooks/…`                                    |
| `scripts/icons.mjs` | `scripts/icons.mjs`                          |

Imports inside the components use `@/components/m3e/…` and `@/lib/m3e/…`, so keep the default shadcn aliases (`@/components`, `@/lib`).

## Check it works

```tsx
import { Button } from "@/components/m3e/button"

export default function App() {
  return <Button>Hello, M3E</Button>
}
```

The button should morph its corners when pressed and show a ripple. If it looks flat, the stylesheet import in step 3 is missing.

## Copying by hand

You can also copy files from the repository. The registry does the same thing, plus dependency resolution: `src/components/m3e`, `src/lib/m3e` and `src/styles/m3e.css`. Keep the paths, install the npm packages the files import, and run `node scripts/icons.mjs` to bundle the icons.
