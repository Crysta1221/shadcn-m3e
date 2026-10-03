# From shadcn/ui

M3E components are drop-in replacements for the shadcn/ui ones: same exports, same props, same Base UI behavior.

## 1. Install and switch the imports

Add the registry once (see [Installation](/docs/installation)), then install what you use:

```bash
npx shadcn@latest add @m3e/base @m3e/button @m3e/dialog
```

The files land in `components/m3e`, next to your existing `components/ui`. Change the imports:

```tsx
// before
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// after
import { Button } from "@/components/m3e/button"
import { Dialog, DialogContent } from "@/components/m3e/dialog"
```

A find-and-replace of `@/components/ui/` with `@/components/m3e/` is enough for most code. `@/components/ui` stays in the repository as the pristine output of `shadcn add`, useful as a reference and for diffs.

## 2. What changes visually

- **Shape and size** follow M3E: buttons are pills from 32dp to 136dp that morph when pressed, cards use the `medium` corner, dialogs `extra-large`.
- **Color** comes from roles, not shadcn's gray scale. Your `bg-muted`, `text-muted-foreground`, `bg-primary` still work — they map to roles (see [Color](/docs/color)).
- **Motion** is spring-based, and interactive elements have a ripple.

## 3. Props that were added

Existing props keep working. New ones are optional:

| Component | Added                                                                                                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`  | `variant` accepts `filled`, `tonal`, `elevated`, `outlined`, `text` (the old names are aliases); `size` `xs`–`xl`; `shape`; `width` for icon buttons; `disableRipple`                                         |
| `Card`    | `variant` (`filled`, `elevated`, `outlined`), `interactive`                                                                                                                                                   |
| `Badge`   | `NotificationBadge` for counts and dots                                                                                                                                                                       |
| `Sonner`  | A real M3 snackbar (one at a time, no stacking). Import `toast` from `@/components/m3e/sonner` instead of `sonner`; the call signature is the same, but `richColors`, `expand`, `visibleToasts` etc. are gone |

The component pages list every difference under **Props**.

## 4. Class names that moved

The `rounded-*` scale is remapped to the M3 corners (`rounded-md` is 12px, `rounded-xl` 20px, `rounded-2xl` 28px…), and the type scale, colors and shadows are M3 ones. Tailwind’s own `shadow-sm` / `shadow-md` still exist; use `shadow-elevation-*` for M3 levels.

If something looks too round or too flat, check [Shape](/docs/shape) and [Elevation](/docs/elevation).

## 5. Components shadcn/ui doesn't have

Navigation bar and rail, app bar, toolbars, FAB, FAB menu, split button, chips, search, carousel, time picker, loading indicator. They are marked **M3E only** in the [component list](/components).

## Adding a new shadcn/ui component later

`shadcn add <name>` writes to `components/ui`. Check whether M3E has that component (`npx shadcn@latest add @m3e/<name>`); if not, restyle the shadcn one with the M3E tokens and import `cn` from `@/lib/m3e/cn`, which knows the M3 type scale.
