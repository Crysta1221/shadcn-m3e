/**
 * The structure of the guide (`/docs`). Each page is a Markdown file in
 * `src/docs/content/<slug>.md`; add a page by writing the file and listing it
 * here. The component reference is generated separately (`data/*.ts`).
 */
export type GuidePage = {
  slug: string
  title: string
  /** Material Symbols name, shown in the navigation */
  icon: string
  /** one line, for cards and search */
  description: string
}

export type GuideSection = {
  title: string
  pages: GuidePage[]
}

export const OUTLINE: GuideSection[] = [
  {
    title: "Getting started",
    pages: [
      {
        slug: "introduction",
        title: "Introduction",
        icon: "waving_hand",
        description: "What shadcn M3E is and how it is put together.",
      },
      {
        slug: "installation",
        title: "Installation",
        icon: "download",
        description:
          "Add the registry and install components with the shadcn CLI.",
      },
      {
        slug: "usage",
        title: "Usage",
        icon: "play_circle",
        description: "Import components, variants and sizes, links and icons.",
      },
    ],
  },
  {
    title: "Foundations",
    pages: [
      {
        slug: "color",
        title: "Color",
        icon: "palette",
        description:
          "Color roles, Tailwind classes, dynamic color and contrast.",
      },
      {
        slug: "theming",
        title: "Themes",
        icon: "format_paint",
        description:
          "Change every color at runtime from a color code or an image; scopes, dark mode, freezing a theme.",
      },
      {
        slug: "shape",
        title: "Shape",
        icon: "interests",
        description: "The corner scale and shape morphing.",
      },
      {
        slug: "typography",
        title: "Typography",
        icon: "text_fields",
        description: "The type scale, its emphasized styles and the fonts.",
      },
      {
        slug: "elevation",
        title: "Elevation",
        icon: "layers",
        description: "Five elevation levels.",
      },
      {
        slug: "motion",
        title: "Motion",
        icon: "animation",
        description: "The spring motion scheme and the utilities built on it.",
      },
      {
        slug: "state-layers",
        title: "States & ripple",
        icon: "touch_app",
        description: "Hover, focus and press feedback, and the ripple.",
      },
      {
        slug: "icons",
        title: "Icons",
        icon: "emoji_symbols",
        description:
          "Bundled Material Symbols: only the icons you use, filled states, gen:icons.",
      },
    ],
  },
  {
    title: "Guides",
    pages: [
      {
        slug: "migrating",
        title: "From shadcn/ui",
        icon: "swap_horiz",
        description: "Moving an existing shadcn/ui project to M3E.",
      },
      {
        slug: "playground",
        title: "Playground",
        icon: "draw",
        description:
          "Sketch a screen from M3E parts and copy it as shadcn M3E code or a prompt.",
      },
      {
        slug: "registry",
        title: "Registry",
        icon: "inventory_2",
        description: "What the shadcn registry contains and how to host it.",
      },
      {
        slug: "writing-docs",
        title: "Writing docs",
        icon: "edit_document",
        description: "Add a guide page or a component page with live examples.",
      },
    ],
  },
  {
    title: "Project",
    pages: [
      {
        slug: "changelog",
        title: "Changelog",
        icon: "history",
        description:
          "What changed in the components, the registry and the docs, newest first.",
      },
    ],
  },
]

export const GUIDE_PAGES = OUTLINE.flatMap((s) => s.pages)
