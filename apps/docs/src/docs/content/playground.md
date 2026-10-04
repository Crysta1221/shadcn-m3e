# Playground

The [Playground](/playground) is a canvas for putting screens together out of the components of this registry. Every part on it is the **real shadcn M3E component**, not a picture of one, so what you see is what the code builds.

It is based on [lnkiai/m3e-canvas](https://github.com/lnkiai/m3e-canvas) (MIT) and lives in `apps/canvas`: a separate Next.js app, hosted apart from this site and embedded here.

## Put a screen together

The palette lists the same components as the [Components](/components) section, in the same categories and under the same names. Drag one onto a phone or desktop screen, or press its tile to add it in view.

Select a part to edit it. The panel is built from the component's own props: its text, variant, size, shape, icons, the rows of a list (tabs, destinations, menu entries), and the state it starts in. The scheme comes from the **Color** panel; its seed color is the one the generated code asks `M3eProvider` for.

Components that open something (dialogs, sheets, menus, popovers, tooltips, the snackbar) are drawn closed, as their trigger. The code you copy has the full content.

`Sidebar` and `Theme provider` are drawn contained, since the real ones are page-level: the sidebar as a static panel, the theme provider as an `M3ThemeScope` preview.

## Copy the code

Open the **Prompt** panel on the right and choose **Code**. Each screen becomes one React component built from the shadcn M3E components, placed where it sits in the sketch.

The header of the file lists what to run in your project:

```bash
npx shadcn@latest add @m3e/base @m3e/button @m3e/card
```

1. Add the registry to `components.json` (see [Installation](/docs/installation)).
2. Install the components the code imports with the command at the top of the file.
3. Wrap your app once in `M3eProvider`, with the seed color the file suggests.

The layout is the sketch's own: each run of parts is positioned absolutely inside a box the size of its screen. Treat it as a faithful starting point, not finished responsive code.

## Copy the prompt

Choose **Prompt** to get a description of the sketch for a coding model: the colors, layout, behavior and navigation between screens, in English, Japanese, Chinese or Korean. It always asks for a web app built with the shadcn M3E components, which it assumes are already installed, and it names each part by the component and props it stands for.

## Run it yourself

```bash
bun run dev:canvas
```

Check that the registry of parts matches the docs, and that the code for every part (default props and every choice of every enum) type-checks against the components:

```bash
cd apps/canvas && bun run check:codegen
```

The docs embed the Playground from `PLAYGROUND_ORIGIN` in `src/docs/site.ts`; set `VITE_PLAYGROUND_URL` to point at another host.
