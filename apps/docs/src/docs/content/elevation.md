# Elevation

M3 uses six levels, 0 to 5. Each one combines a key shadow and an ambient shadow.

| Class                | Typical use                                             |
| -------------------- | ------------------------------------------------------- |
| `shadow-elevation-0` | Filled surfaces at rest                                 |
| `shadow-elevation-1` | Elevated cards and buttons, hovered filled buttons      |
| `shadow-elevation-2` | Menus, raised bars                                      |
| `shadow-elevation-3` | FAB, dialogs, search, docked toolbars                   |
| `shadow-elevation-4` | Hovered or focused raised surfaces (e.g. a hovered FAB) |
| `shadow-elevation-5` | Dragged surfaces                                        |

```tsx
<div className="rounded-lg bg-surface-container-low shadow-elevation-1 hover:shadow-elevation-2">
  …
</div>
```

## Prefer tone over shadow

M3 separates surfaces mainly by tone. Reach for `surface-container-*` first (see [Color](/docs/color)), and add a shadow only where a surface floats above the content, such as a menu or a FAB.

## Interaction

Components change their elevation with state — a filled button gains `elevation-1` on hover and drops to none while pressed. The change rides the effects spring through `transition-shape`.
