# Registry

The components are published as a [shadcn registry](https://ui.shadcn.com/docs/registry). This page explains what is in it and how to host your own copy.

## Items

Each file in `src/components/m3e` is an item named after the file: `@m3e/button`, `@m3e/card`, `@m3e/navigation`. A few items are made of several files that only work together:

| Item              | Files                                                                                             | Why                                     |
| ----------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `styles`          | `m3e.css`, `m3e.generated.css`                                                                    | Tokens and utilities                    |
| `cn`              | `cn.ts`                                                                                           | The merge helper                        |
| `theme`           | `m3e-provider`, `color-mode-provider`, `m3-theme-provider`, `m3-theme-scope`, `color`, `baseline` | Light / dark and the color scheme       |
| `use-image-theme` | `use-image-theme`, `vibrant`                                                                      | Themes from images (needs node-vibrant) |
| `icon`            | `icon`, `icon-registry`, `icon-data`, `icon-data.app`, `symbols`, `scripts/icons.mjs`             | Bundled Material Symbols                |
| `shapes`          | `shapes.ts`                                                                                       | Loading-indicator geometry              |
| `use-mobile`      | `use-mobile.ts`                                                                                   | Used by the sidebar                     |

And two with no files, only dependencies:

| Item   | Installs                                                    |
| ------ | ----------------------------------------------------------- |
| `base` | `styles`, `cn`, `theme`, `icon` — what a project needs once |
| `all`  | `base` and every component                                  |

## Dependencies are read from the code

Nothing is listed by hand. The build reads the imports of each file:

- `@/components/m3e/ripple` becomes the registry dependency `@m3e/ripple`.
- `class-variance-authority`, `@base-ui/react`… become npm dependencies. React itself is left out.
- `Icon` names become the **Icons** row on the component pages.

So a component page's install command, its packages and its files are always what the code really needs.

## Build

```bash
bun run registry:build
```

writes `public/r/<name>.json` for every item and `public/r/registry.json` as the index. It also writes `src/docs/registry-meta.generated.ts`, which the docs read. It runs before `dev` and `build`, so `bun run build` output contains the registry.

Every file is checked against shadcn's own schema, and the result has been installed into a fresh Vite project, type-checked and built.

## Host it

`public/r` is part of the site build, so any static host serves it:

```bash
bun run build   # dist/r/button.json, dist/r/registry.json…
```

Then users point `components.json` at it:

```json
{ "registries": { "@m3e": "https://your-domain/r/{name}.json" } }
```

The shadcn CLI fetches the files itself, so no CORS setup is needed. To keep old versions available, deploy each release to its own path (`/r/v1/{name}.json`) and let users choose.

Set `M3E_REGISTRY_HOMEPAGE` to change the `homepage` field of `registry.json` (it defaults to the hosted site).

## Use the hosted registry

This site serves its own registry. Point `components.json` at it and install by name:

```json
{ "registries": { "@m3e": "{{origin}}/r/{name}.json" } }
```

```bash
npx shadcn@latest add @m3e/button
```

## Updating

The code is yours after install. To take a newer version of a component, run the same command with `--overwrite`, and review the diff in git:

```bash
npx shadcn@latest add @m3e/button --overwrite
```

`icon-data.app.ts` and any file you changed are yours to keep: skip them when the CLI asks.
