# States & ripple

Interactive M3 components show state with an overlay of their content color — the **state layer** — and the pointer press with a **ripple**.

## State layer

| State   | Opacity |
| ------- | ------- |
| Hover   | 8%      |
| Focus   | 10%     |
| Pressed | 10%     |
| Dragged | 16%     |

Add `state-layer` to any interactive element. It draws the overlay with `currentColor` and follows the element's corners:

```tsx
<button className="state-layer rounded-full bg-secondary-container px-4 py-2 text-on-secondary-container">
  Custom control
</button>
```

Use `state-layer-<color>` to overlay another color, and `state-layer-circle` for round layers on selection controls (checkbox, radio, switch).

## Focus ring

`focus-ring` draws the M3 focus indicator on keyboard focus only: a 3px `secondary` outline, 2px outside the element. `focus-ring-inset` draws it inside, for elements that are clipped or edge to edge.

## Pressed state

Components set `data-press` on themselves while pressed, and keep it for at least 225ms so a fast click still shows the whole shape morph. Style it instead of `:active`:

```tsx
<button className="transition-shape rounded-full data-press:rounded-lg">
  Press me
</button>
```

A pointer press starts it at once, Space holds it until the key is released, Enter holds it for the minimum time.

## Ripple

`Ripple` is a port of Material Web's `<md-ripple>`: a soft-edged circle starts at the press position, grows past the corners while it travels to the centre (450ms), fades in over 105ms and out over 375ms. Touch presses wait 150ms, so scrolling never lights up a button.

```tsx
import { Ripple } from "@/components/m3e/ripple"

;<button className="relative overflow-hidden rounded-full px-4 py-2">
  <Ripple />
  Label
</button>
```

The ripple attaches to its parent, so the parent needs `position: relative` and rounded corners; the ripple inherits the corners. Change its color with `ripple-<color>` on the parent:

```tsx
<button className="ripple-primary relative overflow-hidden">…</button>
```

> With a ripple inside, the ripple replaces the state layer's pressed overlay, as in Material Web. Hover and focus still use the state layer.

## Turning it off

`Button` takes `disableRipple`. Elsewhere, leave the `<Ripple />` out, or pass `<Ripple disabled />` to keep the pressed-state tracking without the animation.

## Interactive cards

`Card` gets a state layer, a ripple, an elevation change and a focus ring when it is `interactive`:

```tsx
<Card interactive tabIndex={0} onClick={open}>
  …
</Card>
```
