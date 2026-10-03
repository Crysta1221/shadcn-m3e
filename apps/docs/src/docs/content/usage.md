# Usage

Import from `@/components/m3e/*` where you would import from `@/components/ui/*`. Nothing else is required: `<Button>` is expressive without configuration.

```tsx
import { Button } from "@/components/m3e/button"

export function Example() {
  return (
    <>
      <Button>Filled</Button>
      <Button variant="tonal" size="lg" shape="square">
        Tonal
      </Button>
    </>
  )
}
```

## Variants, sizes and shapes

Buttons use the M3E names, with the shadcn/ui names kept as aliases.

| Prop      | Values                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------- |
| `variant` | `filled` · `tonal` · `elevated` · `outlined` · `text` (aliases: `default`, `secondary`, `outline`, `ghost`, `link`) |
| `size`    | `xs` · `sm` · `md` · `lg` · `xl` (plus `icon-xs` … `icon-xl` for icon buttons)                                      |
| `shape`   | `round` (default) · `square`                                                                                        |
| `width`   | `narrow` · `default` · `wide`, icon buttons only                                                                    |

Pressing a button morphs its corners; a toggle morphs between round and square when selected. This needs no code — it is part of the component.

## Links and other elements

Base UI's `render` prop replaces the element while keeping the styles, ripple and press behavior:

```tsx
import { Link } from "@tanstack/react-router"

;<Button render={<Link to="/docs" />} nativeButton={false}>
  Docs
</Button>
```

Pass `nativeButton={false}` when `render` produces something that isn't a `<button>`.

## Icons

Use `Icon` with a Material Symbols name:

```tsx
import { Icon } from "@/components/m3e/icon"

;<Button>
  <Icon name="add" />
  New
</Button>
```

Icons are bundled, so run `gen:icons` after using a new one. See [Icons](/docs/icons) for filled states and how that works.

## Tailwind classes

The design tokens are available as ordinary Tailwind classes:

```tsx
<div className="rounded-xl bg-surface-container p-4 text-on-surface shadow-elevation-2">
  <h2 className="text-title-large">Title</h2>
  <p className="text-body-medium text-on-surface-variant">Supporting text</p>
</div>
```

Read the foundations to see what each family contains: [Color](/docs/color), [Shape](/docs/shape), [Typography](/docs/typography), [Elevation](/docs/elevation), [Motion](/docs/motion).

## Disabling the ripple

`Button` accepts `disableRipple`:

```tsx
<Button disableRipple>No ripple</Button>
```
