# Icons

Icons are **Material Symbols Rounded**. They are bundled with your code: the glyphs you use are written into a small data file, and nothing is fetched at runtime. There is no icon font, and no whole icon set in the bundle — only the icons you use.

```tsx
import { Icon } from "@/components/m3e/icon"

<Icon name="favorite" />
<Icon name="favorite" fill />
<Icon name="favorite" size={20} />
```

`name` is the Material Symbols name — the spelling from the Google Fonts catalog (`arrow_back`) or Iconify's (`arrow-back`).

## Adding an icon

1. Use it: `<Icon name="rocket_launch" />`.
2. Bundle it:

```bash
npm run gen:icons
```

The script reads your source, finds the icons, downloads exactly those glyphs from [Iconify](https://iconify.design/) and writes them to `icon-data.app.ts`. Commit the file.

In development, an icon that is not bundled logs a warning in the console instead of failing quietly.

## What the script finds

| Written as                                      | Found                                |
| ----------------------------------------------- | ------------------------------------ |
| `<Icon name="home" />`, `icon="home"`           | yes (`name` counts on `<Icon>` only) |
| `icon: "home"` in an object                     | yes                                  |
| `name={open ? "close" : "menu"}`                | yes, both                            |
| `["home", "Home"]` (a name followed by a label) | yes                                  |
| A name built at runtime                         | no — list it with a comment          |

For names built at runtime, add a comment anywhere in a source file:

```ts
// @icons wifi wifi_off signal_wifi_bad
```

## Two data files

| File               | Holds                                                            | Owner                                      |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------ |
| `icon-data.ts`     | Icons the M3E components use themselves (chevrons, check marks…) | Ships with the registry.                   |
| `icon-data.app.ts` | Icons your code uses                                             | Yours. Starts empty; `gen:icons` fills it. |

Each name is stored twice, outlined and filled, so `fill` works everywhere. That is about 400 bytes per icon.

## CI

```bash
npm run check:icons
```

exits with an error if an icon does not exist in Material Symbols, or if the data files are out of date. It writes nothing.

## Filled and outlined

M3 shows icons **outlined** by default and **filled** when their control is selected. `fill` controls it:

| `fill`            | Result                                                     |
| ----------------- | ---------------------------------------------------------- |
| `false` (default) | Outlined                                                   |
| `true`            | Filled                                                     |
| `"auto"`          | Outlined, filled while the surrounding control is selected |

`"auto"` looks for `aria-pressed`, `aria-selected`, `aria-current="page"`, `data-active`, `data-pressed` and `data-checked` on an ancestor. Navigation items, toggle buttons and tabs use it, which is why the rail icon fills when its page is open.

```tsx
<Toggle aria-label="Favorite">
  <Icon name="favorite" fill="auto" />
</Toggle>
```

## Sizing

Inside components, icons take their size from the component (`[&_svg]:size-5` on a small button). Set `size` on `Icon` only for icons of your own. It defaults to 24.

## Other icons

Anything Iconify has can be registered next to the Material Symbols:

```ts
import { registerIcons } from "@/components/m3e/icon"
import brands from "./my-brand-icons.json" // Iconify JSON

registerIcons(brands)
```

and used with the `@iconify/react/offline` `Icon` and the `prefix:name` string.

## Icons used inside components

The glyphs the components themselves use are listed on each [component page](/components) under **Icons**, and the code is in `src/components/m3e/symbols.tsx`, so you can restyle or swap them in one place.
