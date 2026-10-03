# Introduction

shadcn M3E is **Material 3 Expressive** for shadcn/ui. It keeps the shadcn/ui workflow — you own the source, components are built on Base UI, styling is Tailwind CSS v4 — and replaces the look and motion with M3E.

## What you get

- **Every shadcn/ui component, restyled.** `Button`, `Dialog`, `Select`, `Tabs`… keep their API and gain M3E sizes, shapes, colors, springs and ripple.
- **The M3E components shadcn/ui doesn't have.** Navigation bar and rail, app bar, toolbars, FAB and FAB menu, split button, chips, search, carousel, time picker, loading indicator, wavy progress, notification badge.
- **Real Material color.** Themes are generated with Google's material-color-utilities from a seed color or from an image (through node-vibrant), for light and dark, in three contrast levels.
- **Tokens from the source.** Sizes, shapes, type and motion are taken from the Compose Material3 token files, not eyeballed. See `NOTICE` for the sources.

## How it is organized

| Path                              | What lives there                                                     |
| --------------------------------- | -------------------------------------------------------------------- |
| `packages/m3e/src/components`     | The components you import.                                           |
| `packages/m3e/reference/ui`       | Untouched shadcn/ui output, kept for reference. Not used by the app. |
| `packages/m3e/src/styles/m3e.css` | Design tokens and the Tailwind utilities built on them.              |
| `packages/m3e/src/lib`            | Color generation, image extraction, shape morphing.                  |
| `apps/docs`                       | This documentation site, which also serves the registry.             |

> M3 and M3E differ in many places (shapes, sizes, motion). This project follows **M3E** everywhere; where the two disagree, the expressive version wins.

## Where to go next

1. [Installation](/docs/installation) — add the registry and install components with the shadcn CLI.
2. [Usage](/docs/usage) — the few things that differ from plain shadcn/ui.
3. [Components](/components) — every component with live examples and props.
4. [Theme from an image](/theme) — try dynamic color.
