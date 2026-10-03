# Shape

Corners follow the M3 scale. Use the Tailwind `rounded-*` classes; they are remapped to the M3 tokens:

| Class          | Token                 | Radius |
| -------------- | --------------------- | ------ |
| `rounded-none` | none                  | 0      |
| `rounded-xs`   | extra small           | 4px    |
| `rounded-sm`   | small                 | 8px    |
| `rounded-md`   | medium                | 12px   |
| `rounded-lg`   | large                 | 16px   |
| `rounded-xl`   | large increased       | 20px   |
| `rounded-2xl`  | extra large           | 28px   |
| `rounded-3xl`  | extra large increased | 32px   |
| `rounded-4xl`  | extra extra large     | 48px   |
| `rounded-full` | full                  | 9999px |

So `rounded-lg` is M3's "large" corner, and shadcn/ui code that uses `rounded-md` or `rounded-xl` lands on a real M3 value.

## Scaling all corners

Every token is multiplied by `--md-sys-shape-scale` (default `1`). `M3ThemeProvider` sets it from `shapeScale`; you can also set it yourself:

```css
:root {
  --md-sys-shape-scale: 0.5; /* squarer */
}
```

## Shape morphing

M3E shapes change with state. A button is fully round at rest and morphs to a smaller radius while pressed; a toggle button is round when off and square when selected. Components expose the radii as CSS variables:

| Variable           | Meaning                                    |
| ------------------ | ------------------------------------------ |
| `--btn-r`          | resting corner                             |
| `--btn-r-pressed`  | corner while pressed                       |
| `--btn-r-selected` | corner when selected (toggles)             |
| `--btn-h2`         | half of the height, used for "fully round" |

Use `transition-shape` on your own elements to get the same spring on `border-radius`:

```tsx
<button className="transition-shape rounded-[28px] data-press:rounded-md">
  Press me
</button>
```

> Round corners are written as a real radius (`--btn-h2`, or `rounded-[28px]`) rather than `rounded-full`. A spring that overshoots while animating from 9999px to a small radius passes through zero for a frame, which shows up as a flash of square corners.

## Loading indicator shapes

The loading indicator morphs between seven polygons (soft burst, cookie, pentagon…). The geometry lives in `src/lib/m3e/shapes.ts`.

## Shape library

`<Shape>` clips content to one of the 35 Material shape-library shapes and morphs between them — see [Components → Shape](/components/shape).
