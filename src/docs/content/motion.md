# Motion

M3E replaces fixed durations with **springs**. Each spring has a speed (fast, default, slow) and a type: **spatial** springs move things (position, size, shape) and may overshoot; **effects** springs change color and opacity and never overshoot.

## Utilities

| Class                                           | Use                                                                    |
| ----------------------------------------------- | ---------------------------------------------------------------------- |
| `motion-spatial-fast` · `-default` · `-slow`    | Position, size, shape                                                  |
| `motion-effects-fast` · `-default` · `-slow`    | Color, opacity                                                         |
| `transition-shape`                              | Corner radius, colors, elevation and size, each on the right spring    |
| `motion-popup`, `motion-menu`                   | Popups and menus (Base UI `data-starting-style` / `data-ending-style`) |
| `motion-dialog`, `motion-scrim`, `motion-sheet` | Dialog, its backdrop, side sheets                                      |

They set `transition-timing-function` and `transition-duration`; add the property yourself:

```tsx
<div className="translate-x-0 transition-transform motion-spatial-default data-open:translate-x-4">
  …
</div>
```

## How the springs are made

The springs are the values of the Compose `ExpressiveMotionTokens` (stiffness and damping ratio). `bun run gen:tokens` solves each spring and writes it as a CSS `linear()` easing with a matching duration to `src/styles/m3e.generated.css`. CSS can't animate a real spring, but a sampled one looks the same.

| Spring                        | Expressive        | Standard          |
| ----------------------------- | ----------------- | ----------------- |
| Fast spatial                  | 360ms             | 230ms             |
| Default spatial               | 440ms             | 320ms             |
| Slow spatial                  | 600ms             | 490ms             |
| Fast / default / slow effects | 150 / 240 / 330ms | 150 / 240 / 330ms |

## Expressive or standard

The motion scheme is chosen by `data-motion` on `<html>`:

```tsx
setTheme({ motion: "standard" }) // less bounce, shorter durations
```

Expressive is the default. Standard has less overshoot and shorter spatial springs, a better fit for dense or data-heavy UI.

## Reduced motion

Springs that overshoot are the first thing to remove for people who ask for less motion:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --md-sys-motion-spring-fast-spatial: linear;
    --md-sys-motion-spring-default-spatial: linear;
    --md-sys-motion-spring-slow-spatial: linear;
  }
}
```
