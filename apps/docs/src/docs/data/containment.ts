import type { DocEntry } from "../registry"

export const containment: DocEntry[] = [
  {
    slug: "card",
    name: "Card",
    category: "Containment",
    icon: "credit_card",
    origin: "shadcn",
    description:
      "Groups content about one subject. Filled, elevated or outlined, with 12dp corners.",
    spec: "https://m3.material.io/components/cards/overview",
    imports: [
      {
        from: "card",
        names: [
          "Card",
          "CardHeader",
          "CardTitle",
          "CardDescription",
          "CardContent",
          "CardFooter",
        ],
      },
    ],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: '"filled" | "elevated" | "outlined"',
            default: '"filled"',
            description: "Container style.",
          },
          {
            name: "interactive",
            type: "boolean",
            default: "false",
            description:
              "Adds hover, press and focus feedback for clickable cards.",
          },
          {
            name: "size",
            type: '"sm" | "default" | "lg"',
            default: '"default"',
            description: "Inner spacing: 12, 16 or 24dp.",
          },
        ],
      },
    ],
  },
  {
    slug: "dialog",
    name: "Dialog",
    category: "Containment",
    icon: "web_asset",
    origin: "shadcn",
    description:
      "A modal window for a task or a decision. surface-container-high, 28dp corners, elevation 3; it scales in on the spatial spring.",
    spec: "https://m3.material.io/components/dialogs/overview",
    imports: [
      {
        from: "dialog",
        names: [
          "Dialog",
          "DialogTrigger",
          "DialogContent",
          "DialogHeader",
          "DialogTitle",
          "DialogDescription",
          "DialogFooter",
          "DialogClose",
        ],
      },
    ],
    notes: [
      "Put actions in DialogFooter as text buttons. Use showCloseButton={false} when the dialog has its own actions.",
    ],
  },
  {
    slug: "alert-dialog",
    name: "Alert dialog",
    category: "Containment",
    icon: "report",
    origin: "shadcn",
    description:
      "A dialog that interrupts the user for a decision. It cannot be dismissed by clicking outside.",
    spec: "https://m3.material.io/components/dialogs/overview",
    imports: [
      {
        from: "alert-dialog",
        names: [
          "AlertDialog",
          "AlertDialogTrigger",
          "AlertDialogContent",
          "AlertDialogHeader",
          "AlertDialogTitle",
          "AlertDialogDescription",
          "AlertDialogFooter",
          "AlertDialogCancel",
          "AlertDialogAction",
        ],
      },
    ],
  },
  {
    slug: "sheet",
    name: "Sheet",
    category: "Containment",
    icon: "side_navigation",
    origin: "shadcn",
    description:
      "Modal sheets that slide in from an edge on the slow spatial spring and cover the content with a scrim: the modal side sheet, and the bottom sheet. For a side panel that stays next to the content, see Side sheet.",
    spec: "https://m3.material.io/components/side-sheets/overview",
    imports: [
      {
        from: "sheet",
        names: [
          "Sheet",
          "SheetTrigger",
          "SheetContent",
          "SheetHeader",
          "SheetTitle",
          "SheetDescription",
          "SheetFooter",
          "SheetClose",
        ],
      },
    ],
    props: [
      {
        title: "SheetContent",
        rows: [
          {
            name: "side",
            type: '"top" | "right" | "bottom" | "left"',
            default: '"right"',
            description: "Which edge the sheet enters from.",
          },
        ],
      },
    ],
  },
  {
    slug: "side-sheet",
    name: "Side sheet",
    category: "Containment",
    icon: "right_panel_open",
    origin: "m3e",
    description:
      "A panel beside the content that shares the window with it. Opening widens it on the spatial spring and the content next to it reflows. Docked to the edge, or detached with rounded corners.",
    spec: "https://m3.material.io/components/side-sheets/overview",
    imports: [
      {
        from: "side-sheet",
        names: [
          "SideSheet",
          "SideSheetHeader",
          "SideSheetContent",
          "SideSheetFooter",
        ],
      },
    ],
    notes: [
      "Put SideSheet in a flex row next to your content, give the row a height, and toggle open. The sheet is inert while closed.",
      "A sheet that should cover the content and block it is the modal kind: use Sheet (see the last example).",
    ],
    props: [
      {
        title: "SideSheet",
        rows: [
          {
            name: "open",
            type: "boolean",
            default: "true",
            description:
              "Widens the sheet from 0; closed sheets take no space.",
          },
          {
            name: "side",
            type: '"left" | "right"',
            default: '"right"',
            description: "Which edge it sits on.",
          },
          {
            name: "detached",
            type: "boolean",
            default: "false",
            description:
              "Float 16dp from the edges with large rounded corners.",
          },
          {
            name: "width",
            type: "number",
            default: "360",
            description: "Width in px, kept between 256 and 400.",
          },
        ],
      },
      {
        title: "SideSheetHeader",
        rows: [
          { name: "title", type: "ReactNode", description: "The heading." },
          {
            name: "onBack",
            type: "() => void",
            description: "Shows a back button before the title.",
          },
          {
            name: "onClose",
            type: "() => void",
            description: "Shows a close button after the title.",
          },
        ],
      },
    ],
  },
  {
    slug: "drawer",
    name: "Drawer",
    category: "Containment",
    icon: "vertical_align_bottom",
    origin: "shadcn",
    description:
      "A swipeable bottom sheet with a drag handle, and snap points if you want them.",
    spec: "https://m3.material.io/components/bottom-sheets/overview",
    imports: [
      {
        from: "drawer",
        names: [
          "Drawer",
          "DrawerTrigger",
          "DrawerContent",
          "DrawerHeader",
          "DrawerTitle",
          "DrawerDescription",
          "DrawerFooter",
          "DrawerClose",
        ],
      },
    ],
  },
  {
    slug: "popover",
    name: "Popover",
    category: "Containment",
    icon: "comment",
    origin: "shadcn",
    description: "Rich content in a floating surface anchored to a trigger.",
    imports: [
      {
        from: "popover",
        names: [
          "Popover",
          "PopoverTrigger",
          "PopoverContent",
          "PopoverHeader",
          "PopoverTitle",
          "PopoverDescription",
        ],
      },
    ],
  },
  {
    slug: "hover-card",
    name: "Hover card",
    category: "Containment",
    icon: "ads_click",
    origin: "shadcn",
    description:
      "A preview that appears when a link is hovered — the M3 rich tooltip.",
    spec: "https://m3.material.io/components/tooltips/overview",
    imports: [
      {
        from: "hover-card",
        names: ["HoverCard", "HoverCardTrigger", "HoverCardContent"],
      },
    ],
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "Containment",
    icon: "expand_circle_down",
    origin: "shadcn",
    description:
      "A segmented list of expandable sections: 2dp apart, 4dp corners, with the open one fully rounded.",
    imports: [
      {
        from: "accordion",
        names: [
          "Accordion",
          "AccordionItem",
          "AccordionTrigger",
          "AccordionContent",
        ],
      },
    ],
  },
  {
    slug: "collapsible",
    name: "Collapsible",
    category: "Containment",
    icon: "unfold_less",
    origin: "shadcn",
    description: "Shows and hides a region.",
    imports: [
      {
        from: "collapsible",
        names: ["Collapsible", "CollapsibleTrigger", "CollapsibleContent"],
      },
    ],
  },
  {
    slug: "separator",
    name: "Separator",
    category: "Containment",
    icon: "horizontal_rule",
    origin: "shadcn",
    description: "A 1dp outline-variant divider.",
    spec: "https://m3.material.io/components/divider/overview",
    imports: [{ from: "separator", names: ["Separator"] }],
  },
  {
    slug: "scroll-area",
    name: "Scroll area",
    category: "Containment",
    icon: "swap_vert",
    origin: "shadcn",
    description: "A region with custom, unobtrusive scrollbars.",
    imports: [{ from: "scroll-area", names: ["ScrollArea", "ScrollBar"] }],
  },
  {
    slug: "resizable",
    name: "Resizable",
    category: "Containment",
    icon: "vertical_split",
    origin: "shadcn",
    description: "Panels the user can resize by dragging or with the keyboard.",
    imports: [
      {
        from: "resizable",
        names: ["ResizablePanelGroup", "ResizablePanel", "ResizableHandle"],
      },
    ],
  },
  {
    slug: "item",
    name: "List item",
    category: "Containment",
    icon: "list_alt",
    origin: "shadcn",
    description:
      "Rows for lists. The segmented variant is the M3E list: 4dp items with 16dp ends, 2dp apart; items round up on hover and press.",
    spec: "https://m3.material.io/components/lists/overview",
    imports: [
      {
        from: "item",
        names: [
          "ItemGroup",
          "Item",
          "ItemMedia",
          "ItemContent",
          "ItemTitle",
          "ItemDescription",
          "ItemActions",
        ],
      },
    ],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: '"default" | "outline" | "muted" | "segmented"',
            default: '"default"',
            description: "Segmented is the expressive list.",
          },
          {
            name: "size",
            type: '"default" | "sm" | "xs"',
            default: '"default"',
            description: "Row density.",
          },
        ],
      },
    ],
  },
]
