<p align="center">
  <img src="public/icon.svg" width="72" alt="" />
</p>

<h1 align="center">M3E Canvas</h1>

<p align="center">
  <strong>Sketch Material 3 Expressive screens in the browser, link them, tap through them, and copy a prompt for your AI coding tool.</strong>
</p>

<p align="center">
  <a href="https://m3e-canvas.crystaworld.dev/"><img alt="Live demo" src="https://img.shields.io/badge/demo-m3e--canvas.crystaworld.dev-6750A4?logo=googlechrome&logoColor=white" /></a>
  <a href="https://github.com/Crysta1221/shadcn-m3e"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-Crysta1221%2Fshadcn--m3e-181717?logo=github" /></a>
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <img alt="Vite" src="https://img.shields.io/badge/Vite-TanStack%20Router-black?logo=vite" />
  <img alt="React" src="https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61DAFB" />
  <img alt="Material 3 Expressive" src="https://img.shields.io/badge/Material%203-Expressive-EADDFF?logo=materialdesign&logoColor=6750A4" />
  <img alt="No backend" src="https://img.shields.io/badge/backend-none%20(localStorage)-2E6A45" />
</p>

<p align="center">
  <a href="https://m3e-canvas.crystaworld.dev/">Open the app</a>
</p>

> **A fork of [lnkiai/m3e-canvas](https://github.com/lnkiai/m3e-canvas) (MIT)**, kept as the Playground of [shadcn M3E](https://shadcn-m3e.crystaworld.dev) inside this repository (`apps/canvas`). This fork is migrated off Next.js to Vite+ and TanStack Router, draws its parts with the real `@m3e` components from `packages/m3e`, and writes prompts that target the shadcn M3E registry. Upstream fixes are ported by hand rather than merged.

![Sketching a recipes app in M3E Canvas, changing its theme, copying the prompt, an AI coding tool building it, and the app running on Android](docs/story.gif)

<p align="center"><sub>Sketch a recipes app, retheme it, copy the prompt, hand it to an AI coding tool, and run the result on Android. (<a href="docs/story.mp4">mp4</a>)</sub></p>

Works with any AI coding tool that takes a prompt, such as Claude Code, Codex, Gemini CLI or Cursor: copy the prompt, paste it into the tool, and ask for the app.

## What it does

- **Drag-and-drop parts** – buttons, icon buttons, FABs, split buttons, FAB menus, chips, app bars, navigation bars, floating toolbars, tabs, search bars, cards, lists, dialogs, snackbars, text fields, dropdowns, switches, checkboxes, radio buttons, sliders, text, images, camera and map placeholders, badges, boxes and dividers, all drawn to Material 3 Expressive.
- **Real M3E components** – every part on the canvas is the actual shadcn M3E component, so what you sketch is what the prompt asks for.
- **Magnetic connections** – bring two buttons or list items close and they fuse into a connected group; the corners soften as they meet.
- **Real M3 Expressive loading** – the shape-morphing Loading Indicator (ported from material-components-android) and wavy linear / circular progress indicators.
- **Phone and desktop screens** – add as many screens as you like, name them, pick a background, and drag a screen to move everything on it. Switch any screen between a 412×892 phone and a 1280×800 desktop from its label: bars stretch, the navigation bar becomes a rail (and a rail becomes a bar again on a phone), and the parts are laid out again beside it. Screens of both sizes can share one design; same-named screens are written into the prompt as one screen at two widths.
- **Tap to navigate** – give any tappable part, an app bar icon or a navigation bar destination a target screen (or "back") and a transition: slide from any of the four sides, fade, expand or none. Arrows show the flow on the canvas; the preview lets you tap through it, and back plays the transition in reverse.
- **Swipe to navigate** – a screen can open another on a left / right / up / down swipe. In the preview the screen follows your finger, and the reverse swipe goes back.
- **Toggle buttons** – any button can flip on tap, changing its icon and style.
- **Layers and groups** – a layers panel lists the z-order of each screen; drag a row to bring parts forward or send them back, and open a group or a connected run to reorder what is inside it. Select several parts and group them to keep their overlap and move them as one. The prompt describes overlaps and side-by-side rows explicitly so the generated layout keeps them.
- **Theme** – the four M3 Expressive axes in one panel. Color: seven presets or one seed color that becomes a full Material 3 scheme you can fine-tune, light / dark, three contrast levels and a dynamic-color switch (match the phone wallpaper). Shape: square, rounded or full corners for every part at once. Type: Roboto, Roboto Flex, Roboto Serif or the system font, with the emphasized styles. Motion: the standard or the expressive spring scheme, which also drives the preview.
- **Prompt output** – the whole design (or a single screen) becomes a concise natural-language prompt in Japanese, English, Chinese or Korean, including your own notes on what each part does, asking for shadcn M3E code.
- **Tidy** – one button snaps bars to the edges, the FAB to the corner, joins neighbouring list items and buttons, and stacks the rest on 16dp margins. Press it again to undo.
- **Optional AI helper** – bring your own key (OpenAI, Claude, Gemini or DeepSeek) and let the model write a part's behavior note or a screen's description, in your language. Each rewrite can be undone. The key stays in your browser and the request goes straight to the provider; there is no server in between.
- **Export** – copy the prompt (edit it by hand first if you like) or save a screen as a PNG.
- **Share links and AI drafts (beta)** – copy a link that opens your design on anyone's canvas, or copy an instruction for Claude Code, Codex or another coding agent: it reads [agent.md](public/agent.md), sketches what you described, and replies with such a link.
- **Alignment guides**, undo/redo, keyboard shortcuts, seven color themes, a favorites row in the parts panel, and everything is saved in your browser (localStorage).
- **Phone-friendly** – on a phone you get one fixed screen and a buttons-only editor: tap the plus to add a button, tap a button to move it, and edit its text, icon and style in a bottom sheet. The full multi-screen editor is for desktop browsers.

<table>
  <tr>
    <td width="50%"><img src="docs/preview.png" alt="Tap-through preview" /><br /><sub>Preview: tap a part and the linked screen slides in.</sub></td>
    <td width="50%"><img src="docs/prompt.png" alt="Prompt panel" /><br /><sub>Prompt: the design as a concise brief in the selected language.</sub></td>
  </tr>
</table>

<p align="center"><img src="docs/mobile.png" width="240" alt="Phone version" /><br /><sub>Phone: one screen, buttons only, edited in a bottom sheet.</sub></p>

## Keyboard

| Key                       | Action                                         |
| ------------------------- | ---------------------------------------------- |
| `V` / `H`                 | Select / hand tool (hold `Space` to pan)       |
| Wheel, `Ctrl` + wheel     | Pan, zoom                                      |
| `+` `-` `0`               | Zoom in, zoom out, fit                         |
| `Ctrl+Z` / `Ctrl+Shift+Z` | Undo / redo                                    |
| `Ctrl+D`                  | Duplicate                                      |
| Arrows (`Shift` = 8dp)    | Nudge                                          |
| `Ctrl` + drag             | Move without snapping (no guides, no 4dp grid) |
| `Delete`                  | Delete part or screen                          |
| `P`                       | Preview                                        |

## Develop

This is a workspace app of the [shadcn-m3e](https://github.com/Crysta1221/shadcn-m3e) monorepo; run everything from the repository root:

```bash
bun install                # at the workspace root
bun run dev:canvas         # http://localhost:3000
bun run build:canvas       # static build to apps/canvas/dist
bun run deploy:canvas      # deploy to Cloudflare Workers (wrangler)
```

To host it under a sub-path, set `VITE_BASE_PATH=/your-repo` at build time.

## Contributing

Bug reports and pull requests go to the [shadcn-m3e repository](https://github.com/Crysta1221/shadcn-m3e/issues). See the root `AGENTS.md` for the workspace rules; this app has its own `typecheck` and `test` (vitest) scripts.

## Credits

- Upstream project: [lnkiai/m3e-canvas](https://github.com/lnkiai/m3e-canvas) (MIT).
- Loading indicator shapes and animation model: [material-components-android](https://github.com/material-components/material-components-android) (Apache-2.0) via [Aler1x/m3-loading-indicator](https://github.com/Aler1x/m3-loading-indicator). See `NOTICE`.
- Icons: [Material Symbols](https://fonts.google.com/icons) (Apache-2.0). Fonts are loaded from Google Fonts.

## See also

- [matraic/m3e](https://github.com/matraic/m3e) – Material 3 Expressive as Lit web components (MIT), with React bindings and an icon package.
- [Beer CSS](https://www.beercss.com/) – Material Design 3 as a plain CSS framework (MIT). Another way to build the web version of a screen you sketch here.

## License

MIT © lnkiai
