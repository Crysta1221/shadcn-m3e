import type { DocEntry } from "../registry"

export const actions: DocEntry[] = [
  {
    slug: "button",
    name: "Button",
    category: "Actions",
    icon: "touch_app",
    origin: "shadcn",
    description:
      "Buttons let people take action. Five styles, five sizes, and two shapes — pressing one morphs its corners and lights it with a ripple.",
    spec: "https://m3.material.io/components/buttons/overview",
    imports: [{ from: "button", names: ["Button"] }],
    notes: [
      "Use it exactly like the shadcn/ui Button. The shadcn variant names (default, secondary, outline, ghost, destructive, link) map onto the M3 styles.",
      "Filled is the highest emphasis, then tonal, elevated, outlined and text.",
      "Icon-only buttons use the icon-* sizes. They also come in narrow and wide widths.",
      "To make a link that looks like a button pass a link to render and set nativeButton={false}.",
    ],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: '"filled" | "tonal" | "elevated" | "outlined" | "text" | "default" | "secondary" | "tertiary" | "outline" | "ghost" | "destructive" | "link"',
            default: '"default"',
            description:
              "default is the same as filled, secondary the same as tonal, outline the same as outlined and ghost the same as text.",
          },
          {
            name: "size",
            type: '"xs" | "sm" | "default" | "md" | "lg" | "xl" | "icon-xs" | "icon-sm" | "icon" | "icon-md" | "icon-lg" | "icon-xl"',
            default: '"default"',
            description:
              "Heights are 32, 40, 40, 56, 96 and 136dp. The icon sizes are square.",
          },
          {
            name: "shape",
            type: '"round" | "square"',
            default: '"round"',
            description:
              "Round buttons are fully rounded; square ones use the size's square corner. Pressing morphs either into a smaller corner.",
          },
          {
            name: "width",
            type: '"default" | "narrow" | "wide"',
            default: '"default"',
            description: "Width of icon-only buttons.",
          },
          {
            name: "disableRipple",
            type: "boolean",
            default: "false",
            description: "Turn the press ripple off.",
          },
        ],
      },
    ],
  },
  {
    slug: "toggle",
    name: "Toggle",
    category: "Actions",
    icon: "toggle_on",
    origin: "shadcn",
    description:
      "A two-state button. Selecting it swaps its shape (round ↔ square) and its container color.",
    spec: "https://m3.material.io/components/buttons/overview",
    imports: [{ from: "toggle", names: ["Toggle"] }],
    notes: [
      'The standard variant has no container until selected; icons of selected toggles are filled when you use `<Icon fill="auto" />`.',
    ],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: '"default" | "filled" | "tonal" | "outline" | "elevated"',
            default: '"default"',
            description: "Container style when not selected.",
          },
          {
            name: "size",
            type: '"xs" | "sm" | "default" | "md" | "lg"',
            default: '"default"',
            description: "Same sizes as Button.",
          },
          {
            name: "shape",
            type: '"round" | "square"',
            default: '"round"',
            description:
              "The resting shape. A selected toggle takes the other one.",
          },
        ],
      },
    ],
  },
  {
    slug: "toggle-group",
    name: "Toggle group",
    category: "Actions",
    icon: "view_column",
    origin: "shadcn",
    description:
      "A row of toggles that acts as one choice (or many). Standard groups keep their own shapes; connected groups fuse into a single pill.",
    spec: "https://m3.material.io/components/button-groups/overview",
    imports: [
      { from: "toggle-group", names: ["ToggleGroup", "ToggleGroupItem"] },
    ],
    notes: [
      "spacing > 0 (default 3 = 12dp) is a standard group: pressing a button widens it by 15% and its neighbours make room.",
      "spacing={0} is a connected group: 2dp gaps, small inner corners, and the selected item turns fully round.",
    ],
    props: [
      {
        rows: [
          {
            name: "spacing",
            type: "number",
            default: "3",
            description: "Gap in Tailwind spacing units; 0 connects the group.",
          },
          {
            name: "orientation",
            type: '"horizontal" | "vertical"',
            default: '"horizontal"',
            description: "Layout direction.",
          },
          {
            name: "variant / size",
            type: "same as Toggle",
            description: "Applied to every item.",
          },
        ],
      },
    ],
  },
  {
    slug: "button-group",
    name: "Button group",
    category: "Actions",
    icon: "splitscreen",
    origin: "shadcn",
    description:
      "Lays out related buttons. Connected groups fuse them; standard groups keep them apart and let the pressed one grow.",
    spec: "https://m3.material.io/components/button-groups/overview",
    imports: [
      {
        from: "button-group",
        names: ["ButtonGroup", "ButtonGroupSeparator", "ButtonGroupText"],
      },
    ],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: '"connected" | "standard"',
            default: '"connected"',
            description:
              "Connected: 2dp gaps and fused corners. Standard: 12dp gaps and the pressed button expands.",
          },
          {
            name: "orientation",
            type: '"horizontal" | "vertical"',
            default: '"horizontal"',
            description: "Layout direction.",
          },
        ],
      },
    ],
  },
  {
    slug: "split-button",
    name: "Split button",
    category: "Actions",
    icon: "arrow_drop_down_circle",
    origin: "m3e",
    description:
      "One action plus a menu of related ones. The trailing button turns into a circle and its arrow flips while the menu is open.",
    spec: "https://m3.material.io/components/split-button/overview",
    imports: [{ from: "split-button", names: ["SplitButton"] }],
    notes: [
      "Wrap it in a DropdownMenu and pass the menu trigger through renderTrailing to open a menu from the arrow.",
    ],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: "Button variant",
            default: '"default"',
            description: "Style of both segments.",
          },
          {
            name: "size",
            type: '"xs" | "sm" | "md" | "lg" | "xl"',
            default: '"sm"',
            description: "Segment height: 32, 40, 56, 96 or 136dp.",
          },
          {
            name: "open",
            type: "boolean",
            description:
              "Whether the menu is open; drives the trailing shape and arrow.",
          },
          {
            name: "onAction",
            type: "() => void",
            description: "Click handler for the leading segment.",
          },
          {
            name: "renderTrailing",
            type: "(button: ReactElement) => ReactElement",
            description: "Wrap the trailing button, e.g. in a menu trigger.",
          },
        ],
      },
    ],
  },
  {
    slug: "fab",
    name: "FAB",
    category: "Actions",
    icon: "add_circle",
    origin: "m3e",
    description:
      "The floating action button for a screen's primary action, and its extended form with a label.",
    spec: "https://m3.material.io/components/floating-action-button/overview",
    imports: [{ from: "fab", names: ["Fab", "ExtendedFab"] }],
    props: [
      {
        title: "Fab",
        rows: [
          {
            name: "size",
            type: '"sm" | "default" | "md" | "lg"',
            default: '"default"',
            description: "40, 56, 80 or 96dp with 12, 16, 20 and 28dp corners.",
          },
          {
            name: "color",
            type: '"primary-container" | "secondary-container" | "tertiary-container" | "primary" | "secondary" | "tertiary" | "surface"',
            default: '"primary-container"',
            description: "Container color.",
          },
          {
            name: "lowered",
            type: "boolean",
            default: "false",
            description: "Use elevation 1 instead of 3.",
          },
        ],
      },
      {
        title: "ExtendedFab",
        rows: [
          {
            name: "icon",
            type: "ReactNode",
            description: "Leading icon; the label is the children.",
          },
          {
            name: "collapsed",
            type: "boolean",
            default: "false",
            description:
              "Collapse to an icon-only FAB (for example while scrolling).",
          },
        ],
      },
    ],
  },
  {
    slug: "fab-menu",
    name: "FAB menu",
    category: "Actions",
    icon: "menu_open",
    origin: "m3e",
    description:
      "A FAB that opens into a stack of related actions. The FAB becomes a close button, and the items spring in nearest-first.",
    spec: "https://m3.material.io/components/fab-menu/overview",
    imports: [
      {
        from: "fab-menu",
        names: ["FabMenu", "FabMenuTrigger", "FabMenuContent", "FabMenuItem"],
      },
    ],
    notes: [
      'Place the menu where a FAB would go (bottom right). Use align="start" on FabMenuContent when it sits on the left.',
      "Escape and clicks outside close it. Up to six items is recommended.",
    ],
  },
  {
    slug: "chip",
    name: "Chip",
    category: "Actions",
    icon: "label",
    origin: "m3e",
    description:
      "Compact elements for actions, filters, input and suggestions. A filter chip shows a check while selected.",
    spec: "https://m3.material.io/components/chips/overview",
    imports: [{ from: "chip", names: ["Chip", "FilterChip", "InputChip"] }],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: '"flat" | "elevated"',
            default: '"flat"',
            description: "Outlined (flat) or elevated container.",
          },
          {
            name: "icon",
            type: "string | ReactNode",
            description: "Leading icon: a Material Symbols name or a node.",
          },
          {
            name: "size",
            type: '"default" | "md" | "lg"',
            default: '"default"',
            description:
              "Height: 32dp, 40dp or 56dp; padding and icon size follow it.",
          },
          {
            name: "onRemove",
            type: "() => void",
            description: "InputChip only: shows a remove button.",
          },
        ],
      },
    ],
  },
]
