import type { DocEntry } from "../registry"

/** Changing the theme at runtime */
export const theming: DocEntry[] = [
  {
    slug: "theme-provider",
    name: "Theme provider",
    category: "Theming",
    icon: "palette",
    origin: "m3e",
    description:
      "Change every color of the site at runtime from a color code or an image. It generates the light and dark schemes and writes them as CSS variables.",
    imports: [
      { from: "m3e-provider", names: ["M3eProvider"] },
      { from: "color-mode-provider", names: ["useColorMode"] },
      { from: "m3-theme-provider", names: ["useM3Theme"] },
      { from: "m3-theme-scope", names: ["M3ThemeScope"] },
      { from: "use-image-theme", names: ["useImageTheme"] },
    ],
    notes: [
      "Wrap the app in M3eProvider once. It is ColorModeProvider (light / dark) around M3ThemeProvider (colors); use those two directly if you only need one.",
      "Light or dark is the color mode (useColorMode). Which colors the roles have is the theme (useM3Theme).",
      "setSeedColor('#00796B') sets a theme from one color code. updateTheme({ ... }) changes any part: variant, contrast, spec, motion, shapeScale.",
      "useImageTheme is a separate file because it needs node-vibrant; install it only if you want themes from images. applyImage takes the image as you have it (File, Blob, URL, <img>, <canvas>, ImageBitmap, ImageData).",
      "The chosen theme is saved in localStorage and applied before the first paint. Pass persist={false} to turn that off.",
      "M3ThemeScope themes a subtree only. See the Themes guide for the full walkthrough.",
    ],
    props: [
      {
        title: "M3eProvider",
        rows: [
          {
            name: "colorMode",
            type: "Omit<ColorModeProviderProps, 'children'>",
            description: "Props of ColorModeProvider.",
          },
          {
            name: "theme",
            type: "Omit<M3ThemeProviderProps, 'children'>",
            description: "Props of M3ThemeProvider.",
          },
        ],
      },
      {
        title: "ColorModeProvider",
        rows: [
          {
            name: "defaultMode",
            type: '"light" | "dark" | "system"',
            default: '"system"',
            description: "The mode before the user picks one.",
          },
          {
            name: "storageKey",
            type: "string",
            default: '"color-mode"',
            description:
              "localStorage key of the chosen mode. index.html reads it before the first paint.",
          },
          {
            name: "disableTransitionOnChange",
            type: "boolean",
            default: "true",
            description: "Pause CSS transitions while the colors swap.",
          },
          {
            name: "toggleKey",
            type: "string | false",
            default: '"d"',
            description:
              "Key that toggles light / dark outside text fields. false turns it off.",
          },
        ],
      },
      {
        title: "useColorMode()",
        rows: [
          {
            name: "mode",
            type: '"light" | "dark" | "system"',
            description: "What the user chose.",
          },
          {
            name: "resolvedMode",
            type: '"light" | "dark"',
            description: "What is on screen: system resolved by the OS.",
          },
          {
            name: "setMode",
            type: "(mode: ColorMode) => void",
            description: "Choose light, dark or system.",
          },
          {
            name: "toggleMode",
            type: "() => void",
            description: "Light ↔ dark.",
          },
        ],
      },
      {
        title: "M3ThemeProvider",
        rows: [
          {
            name: "defaultTheme",
            type: "Partial<M3Theme>",
            description:
              "The theme before the user picks one, and what resetTheme goes back to.",
          },
          {
            name: "storageKey",
            type: "string",
            default: '"m3-theme"',
            description: "localStorage key of the saved theme.",
          },
          {
            name: "persist",
            type: "boolean",
            default: "true",
            description: "Save the chosen theme in localStorage.",
          },
        ],
      },
      {
        title: "useM3Theme()",
        rows: [
          {
            name: "theme",
            type: "M3Theme",
            description:
              "{ source, variant, contrast, spec, motion, shapeScale }",
          },
          {
            name: "updateTheme",
            type: "(patch: Partial<M3Theme>) => void",
            description: "Change any part of the theme.",
          },
          {
            name: "setSeedColor",
            type: "(hex: string, patch?: Partial<M3Theme>) => void",
            description:
              "Theme from one #RRGGBB color. baseline and image variants become tonalSpot.",
          },
          {
            name: "resetTheme",
            type: "() => void",
            description: "Back to defaultTheme and forget the saved theme.",
          },
          {
            name: "css",
            type: "string",
            description:
              "The CSS the provider writes (a light block and a .dark block). Paste it into a stylesheet to freeze the theme.",
          },
        ],
      },
      {
        title: "M3ThemeScope",
        rows: [
          {
            name: "source",
            type: "{ primary: string; secondary?; tertiary?; neutral? }",
            description: "Key colors of the scope.",
          },
          {
            name: "variant",
            type: "SchemeVariant",
            default: '"tonalSpot"',
            description: "How the scheme is derived from the key colors.",
          },
          {
            name: "contrast",
            type: '"standard" | "medium" | "high"',
            default: '"standard"',
            description: "Contrast level.",
          },
        ],
      },
      {
        title: "useImageTheme()",
        rows: [
          {
            name: "applyImage",
            type: "(image: ThemeImage, opts?: { primary?: string }) => Promise<…>",
            description:
              "ThemeImage is File | Blob | string (URL) | HTMLImageElement | HTMLCanvasElement | ImageBitmap | ImageData. Picks swatches with node-vibrant and applies them as the image variant. primary chooses the seed instead of the Vibrant swatch.",
          },
          {
            name: "pickSwatch",
            type: "(hex: string) => void",
            description: "Use another swatch of the last image as the seed.",
          },
          {
            name: "swatches",
            type: "ImageSwatch[]",
            description: "The swatches of the last image.",
          },
          {
            name: "preview",
            type: "string | null",
            description:
              "A URL to show the last image in an <img>. Freed when the next image replaces it or the component unmounts.",
          },
          {
            name: "loading / error",
            type: "boolean / string | null",
            description: "State of the last call.",
          },
        ],
      },
    ],
  },
]
