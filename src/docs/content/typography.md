# Typography

The M3 type scale is available as Tailwind classes. Each sets font size, line height, letter spacing and weight together.

| Role     | Classes                                    |
| -------- | ------------------------------------------ |
| Display  | `text-display-large`, `-medium`, `-small`  |
| Headline | `text-headline-large`, `-medium`, `-small` |
| Title    | `text-title-large`, `-medium`, `-small`    |
| Body     | `text-body-large`, `-medium`, `-small`     |
| Label    | `text-label-large`, `-medium`, `-small`    |

```tsx
<h1 className="text-display-small">Regular</h1>
<h1 className="text-display-small-emphasized">Emphasized</h1>
```

## Emphasized styles

M3E adds an **emphasized** style for each size (`text-title-large-emphasized`): the same size with a heavier weight. Use it for hierarchy inside a component — a selected tab, a headline in a hero — instead of `font-bold`.

## Fonts

| Family | Font                      | Class       |
| ------ | ------------------------- | ----------- |
| Sans   | Roboto Flex (variable)    | `font-sans` |
| Mono   | JetBrains Mono (variable) | `font-mono` |

`code`, `kbd`, `samp` and `pre` use the mono family by default. Inline `code` gets a small container chip.

## Merging with color classes

`text-label-large` is a size, not a color. The `cn()` helper knows that, so `cn("text-label-large", "text-on-primary")` keeps both. If you use plain `tailwind-merge`, register the scale first — see [Installation](/docs/installation).
