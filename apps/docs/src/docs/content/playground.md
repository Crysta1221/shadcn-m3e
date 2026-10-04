# Playground

The [Playground](/playground) is a canvas for putting screens together out of the components of this registry. Every part on it is the **real shadcn M3E component**, not a picture of one, so what you see is what the code builds.

It is based on [lnkiai/m3e-canvas](https://github.com/lnkiai/m3e-canvas) (MIT) and lives in `apps/canvas`: a separate Next.js app, hosted apart from this site and embedded here.

## Put a screen together

The palette lists the same components as the [Components](/components) section, in the same categories and under the same names. Drag one onto a phone or desktop screen, or press its tile to add it in view.

Select a part to edit it. The panel is built from the component's own props: its text, variant, size, shape, icons, the rows of a list (tabs, destinations, menu entries), and the state it starts in. The scheme comes from the **Color** panel; its seed color is the one the generated code asks `M3eProvider` for.

Components that open something (dialogs, sheets, menus, popovers, tooltips, the snackbar) are drawn open, the way they look in use, and stand where you put them. A dialog has a basic and a full-screen style. The code you copy wraps them in their trigger.

Parts keep their place on the screen: drag the handles to size one (the `width`, `height` or named `size` of the component), and press **Tidy** to pin bars to their edges, a FAB to its corner and a dialog to the middle. Each part can also take a fill color, a text color and corner radii from the **Appearance** section, and an image where the component shows one. In **Play** mode the tabs, navigation bars and rails switch for real, and a part can send a tap to another screen.

When several **Button** parts sit side by side or on top of each other, the screen's panel offers to join them into one **Button group**.

`Sidebar` and `Theme provider` are drawn contained, since the real ones are page-level: the sidebar as a static panel, the theme provider as an `M3ThemeScope` preview.

## Sketches from before

A sketch made with the older, hand-drawn parts still opens and is kept as it was. Select such a part and its panel offers **Convert to the new component**: it becomes the component that stands for it, with its text, icons, sizes, destinations and taps carried over. Anything the component cannot carry (a fill on a button, the pictures of a carousel's slides) is listed first so you can decide. The old part is kept inside the new one, so **Switch back to the old part** (or undo) restores it exactly. Boxes, text, pictures, cameras, maps and bottom sheets have no component to become and stay as they are.

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

Check that the registry of parts matches the docs, and that the code for every part (default props and every choice of every enum), for a sketch of every older part, and for that sketch converted, type-checks against the components:

```bash
cd apps/canvas && bun run check:codegen
```

The docs embed the Playground from `PLAYGROUND_ORIGIN` in `src/docs/site.ts`; set `VITE_PLAYGROUND_URL` to point at another host.
