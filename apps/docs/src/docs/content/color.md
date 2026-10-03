# Color

M3 describes color with **roles** — `primary`, `on-primary`, `primary-container`, `surface-container-high`… — instead of fixed swatches. Components ask for a role; the theme decides the value, for light and dark.

## Using roles

Every role is a Tailwind color, so it works with `bg-*`, `text-*`, `border-*`, `ring-*`, `fill-*` and the opacity modifier:

```tsx
<div className="bg-primary-container text-on-primary-container">
  <span className="text-on-primary-container/70">Supporting</span>
</div>
```

Underneath they are CSS variables (`--md-sys-color-primary-container`) that you can use in your own CSS.

## Roles

| Family  | Roles                                                                                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Accent  | `primary`, `on-primary`, `primary-container`, `on-primary-container` — and the same four for `secondary`, `tertiary`, `error`                                      |
| Fixed   | `primary-fixed`, `primary-fixed-dim`, `on-primary-fixed`, `on-primary-fixed-variant` — same for secondary and tertiary. These do not change between light and dark |
| Surface | `surface`, `surface-dim`, `surface-bright`, `surface-container-lowest`, `-low`, `surface-container`, `-high`, `-highest`, `on-surface`, `on-surface-variant`       |
| Outline | `outline`, `outline-variant`                                                                                                                                       |
| Inverse | `inverse-surface`, `inverse-on-surface`, `inverse-primary`                                                                                                         |
| Other   | `scrim`, `shadow`, `surface-tint`, `background`, `on-background`                                                                                                   |

Pair a background role with its `on-*` role and the text contrast is guaranteed by the scheme.

## Choosing surfaces

Stack surface containers from low to high emphasis instead of adding shadows:

| Use                      | Role                                           |
| ------------------------ | ---------------------------------------------- |
| Page                     | `surface`                                      |
| Cards, sheets at rest    | `surface-container-low` … `surface-container`  |
| Menus, dialogs           | `surface-container` … `surface-container-high` |
| Text fields, code blocks | `surface-container-highest`                    |

## shadcn/ui variables

The shadcn/ui variables (`--background`, `--primary`, `--muted`, `--accent`…) are mapped onto roles, so unmodified shadcn/ui code such as `bg-muted` or `text-muted-foreground` still follows the theme:

| shadcn/ui                     | Role                                              |
| ----------------------------- | ------------------------------------------------- |
| `card`                        | `surface-container-low`                           |
| `popover`                     | `surface-container`                               |
| `muted`, `muted-foreground`   | `surface-container-highest`, `on-surface-variant` |
| `accent`, `accent-foreground` | `secondary-container`, `on-secondary-container`   |
| `border`, `input`             | `outline-variant`, `outline`                      |
| `destructive`                 | `error`                                           |

## Where the values come from

Colors are generated at runtime, see [Theming](/docs/theming). The default is the official **baseline** scheme (the `#6750A4` purple); anything else is computed by material-color-utilities.

- **Light** schemes take the `on-*-container` roles from tone 30, like Compose's expressive theme.
- **Contrast** comes in `standard`, `medium` and `high`.
- **Spec** `2021` (what Compose uses) or `2025`.
