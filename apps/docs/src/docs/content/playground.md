# Playground

The [Playground](/playground) is a canvas for sketching screens out of Material 3 Expressive parts. When the sketch looks right, copy it as **code** built from the components in this registry, or as a **prompt** for a coding model.

It is based on [lnkiai/m3e-canvas](https://github.com/lnkiai/m3e-canvas) (MIT) and lives in `apps/canvas`: a separate Next.js app, hosted apart from this site and embedded here.

## Sketch a screen

Drag parts from the palette onto a phone or desktop screen, connect them into runs, and edit their variant, size, shape, icon and text in the inspector. Switch the color scheme from the panel on the left; it becomes the seed color of the generated code.

## Copy the code

Open the **Prompt** panel on the right and choose **Code**. Each screen becomes one React component: every part is the closest shadcn M3E component (`Button`, `Fab`, `AppBar`, `NavigationBar`, `Card`, `TextField`…), placed where it sits in the sketch.

The header of the file lists the three steps to run it in your project:

```bash
npx shadcn@latest add @m3e/base @m3e/button @m3e/card
```

1. Add the registry to `components.json` (see [Installation](/docs/installation)).
2. Install the components the code imports with the command at the top of the file.
3. Wrap your app once in `M3eProvider`, with the seed color the file suggests.

The layout is the sketch's own: each run of parts is positioned absolutely inside a box the size of its screen. Treat it as a faithful starting point, not finished responsive code. A map, a camera view and an image come out as labelled placeholders.

## Copy the prompt

Choose **Prompt** to get a description of the sketch for a model instead: the colors, layout, behavior and navigation between screens, in English, Japanese, Chinese or Korean.

## Run it yourself

```bash
bun run dev:canvas
```

Check that the generated code still matches the components:

```bash
cd apps/canvas && bun run check:codegen
```

The docs embed the Playground from `PLAYGROUND_ORIGIN` in `src/docs/site.ts`; set `VITE_PLAYGROUND_URL` to point at another host.
