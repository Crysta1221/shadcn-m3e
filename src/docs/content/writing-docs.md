# Writing docs

The site you are reading has two kinds of pages, both plain files in `src/docs`.

## Guide pages (this section)

1. Write `src/docs/content/<slug>.md`.
2. List it in `src/docs/outline.ts`, in the section where it belongs, with a title, a Material Symbols icon and a one-line description.

That's all: the route, the navigation entry, the table of contents (from `##` and `###` headings) and previous / next links come from the outline.

Markdown is parsed by TanStack Markdown — tables, task lists, strikethrough. Fenced code is highlighted with TanStack Highlight and gets a copy button; use `tsx`, `css`, `bash` or `json`.

````md
```tsx
<Button>Hello</Button>
```
````

Links starting with `/` are routed inside the app; others open in a new tab. A blockquote (`>`) renders as a note.

## Component pages

Each component has an entry in `src/docs/data/<category>.ts`:

```ts
{
  slug: "button",
  name: "Button",
  category: "Actions",
  origin: "shadcn", // or "m3e" for components shadcn/ui doesn't have
  icon: "touch_app",
  description: "…",
  imports: [{ from: "button", names: ["Button"] }],
  notes: ["One-line usage tips…"],
  props: [{ title: "Button", rows: [{ name: "variant", type: "…", default: "…", description: "…" }] }],
}
```

Add the entry to the array of its category file and the page, its link in the navigation and the overview card all appear.

## Live examples

Examples are real components in `src/docs/examples/<slug>/<number>-<name>.tsx`:

```tsx
import { Button } from "@/components/m3e/button"

export const meta = {
  title: "Sizes",
  description: "Five sizes, from extra small to extra large.",
}

export default function Example() {
  return <Button size="lg">Large</Button>
}
```

The file's own source is shown as the code below the demo (without `meta`), so what you see and what you copy can never drift apart. Files are ordered by number.

A demo that lays out a whole page (an app shell, anything `position: fixed`) goes in `src/docs/showcases/<name>.tsx` instead. It has the same format, plus `frame` in `meta` for the preview height in px, and appears on the Examples page. Point the component at it with `showcase: "<name>"` in its entry.

## Checking your work

```bash
bun run typecheck   # examples are type-checked like any code
bun run lint
bun run gen:icons   # bundle the icons the docs use
bun run check:icons # they exist and the data is up to date
```
