import type { DocEntry } from "../registry"

/** Content and chat */
export const content: DocEntry[] = [
  {
    slug: "icon",
    name: "Icon",
    category: "Content",
    icon: "emoji_symbols",
    origin: "m3e",
    description:
      'Material Symbols Rounded, bundled with your code (nothing is fetched at runtime). Pass a symbol name; use fill for the filled glyph or fill="auto" to fill while a control is selected.',
    spec: "https://m3.material.io/styles/icons/overview",
    imports: [{ from: "icon", names: ["Icon"] }],
    props: [
      {
        rows: [
          {
            name: "name",
            type: "string",
            description: 'Symbol name, e.g. "home" or "arrow_back".',
          },
          {
            name: "fill",
            type: 'boolean | "auto"',
            default: "false",
            description:
              '"auto" is outlined, and filled while inside a selected control (aria-pressed, data-pressed, aria-selected, data-active, aria-current).',
          },
          {
            name: "size",
            type: "number",
            default: "24",
            description: "Pixels.",
          },
        ],
      },
    ],
  },
  {
    slug: "avatar",
    name: "Avatar",
    category: "Content",
    icon: "account_circle",
    origin: "shadcn",
    description: "A circular image or initials for a person.",
    imports: [
      {
        from: "avatar",
        names: ["Avatar", "AvatarImage", "AvatarFallback", "AvatarGroup"],
      },
    ],
  },
  {
    slug: "carousel",
    name: "Carousel (Embla)",
    category: "Content",
    icon: "view_carousel",
    origin: "shadcn",
    description:
      "shadcn's Embla-based carousel with previous and next buttons. For the expressive multi-browse, hero and uncontained carousels use Expressive carousel.",
    imports: [
      {
        from: "carousel",
        names: [
          "Carousel",
          "CarouselContent",
          "CarouselItem",
          "CarouselPrevious",
          "CarouselNext",
        ],
      },
    ],
  },
  {
    slug: "expressive-carousel",
    name: "Expressive carousel",
    category: "Content",
    icon: "view_carousel",
    origin: "m3e",
    description:
      "Multi-browse, hero, uncontained and full-screen carousels. Items are 28dp-cornered, 8dp apart, and resize continuously between large, medium and small (40–56dp) while you scroll; full-screen slides take the whole track width.",
    spec: "https://m3.material.io/components/carousel/overview",
    imports: [
      {
        from: "expressive-carousel",
        names: ["ExpressiveCarousel", "CarouselSlide"],
      },
    ],
    notes: [
      "Scrolling is native (touch, wheel, arrow keys) and snaps per item.",
      "Item content keeps its large size and is masked by the shrinking item, so design slides for the large width.",
    ],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: '"multi-browse" | "hero" | "uncontained" | "full-screen"',
            default: '"multi-browse"',
            description:
              "Layout. Full-screen items fill the track width and scroll one at a time.",
          },
          {
            name: "itemWidth",
            type: "number",
            default: "186",
            description:
              "Preferred width of a large item, in px (not full-screen).",
          },
          {
            name: "height",
            type: "number",
            default: "221",
            description: "Height in px.",
          },
          {
            name: "gap",
            type: "number",
            default: "8",
            description: "Space between items.",
          },
        ],
      },
    ],
  },
  {
    slug: "table",
    name: "Table",
    category: "Content",
    icon: "table",
    origin: "shadcn",
    description: "A responsive table with a selected-row state.",
    imports: [
      {
        from: "table",
        names: [
          "Table",
          "TableHeader",
          "TableBody",
          "TableRow",
          "TableHead",
          "TableCell",
          "TableCaption",
        ],
      },
    ],
  },
  {
    slug: "chart",
    name: "Chart",
    category: "Content",
    icon: "bar_chart",
    origin: "shadcn",
    description:
      "Recharts wrappers that take their colors from the theme (chart-1 … chart-5 are primary, tertiary, secondary …).",
    imports: [
      {
        from: "chart",
        names: ["ChartContainer", "ChartTooltip", "ChartTooltipContent"],
      },
    ],
  },
  {
    slug: "kbd",
    name: "Kbd",
    category: "Content",
    icon: "keyboard",
    origin: "shadcn",
    description: "Keyboard keys and shortcuts.",
    imports: [{ from: "kbd", names: ["Kbd", "KbdGroup"] }],
  },
  {
    slug: "aspect-ratio",
    name: "Aspect ratio",
    category: "Content",
    icon: "aspect_ratio",
    origin: "shadcn",
    description: "Keeps content at a fixed ratio.",
    imports: [{ from: "aspect-ratio", names: ["AspectRatio"] }],
  },
  {
    slug: "empty",
    name: "Empty",
    category: "Content",
    icon: "inbox",
    origin: "shadcn",
    description: "An empty state with a message and a call to action.",
    imports: [
      {
        from: "empty",
        names: [
          "Empty",
          "EmptyHeader",
          "EmptyMedia",
          "EmptyTitle",
          "EmptyDescription",
          "EmptyContent",
        ],
      },
    ],
  },
  {
    slug: "shape",
    name: "Shape",
    category: "Content",
    icon: "interests",
    origin: "m3e",
    description:
      "The Material shape library as a clip-path: 35 shapes (cookies, clovers, bursts…) that clip their content and morph into each other.",
    spec: "https://m3.material.io/styles/shape",
    imports: [{ from: "shape", names: ["Shape", "SHAPE_NAMES"] }],
    notes: [
      "Changing the name animates the clip-path on the slow effects spring — all polygons share the same point count, so any pair morphs cleanly.",
      "img/video children fill the shape with object-cover; other children lay out normally.",
      "Size it like any box: size-12 by default, override with className (the clip path is in % so it scales).",
      "Shapes are decorative: no ARIA role unless you add one.",
    ],
    props: [
      {
        rows: [
          {
            name: "name",
            type: "ShapeName",
            description:
              'One of the 35 library names ("sunny", "12-sided-cookie", "ghost-ish"…). Omit for a plain box.',
          },
        ],
      },
    ],
  },
  {
    slug: "message",
    name: "Message",
    category: "Chat",
    icon: "forum",
    origin: "shadcn",
    description:
      "A chat message row with an avatar, content, header and footer.",
    imports: [
      {
        from: "message",
        names: [
          "MessageGroup",
          "Message",
          "MessageAvatar",
          "MessageContent",
          "MessageHeader",
          "MessageFooter",
        ],
      },
    ],
  },
  {
    slug: "bubble",
    name: "Bubble",
    category: "Chat",
    icon: "chat_bubble",
    origin: "shadcn",
    description:
      "The bubble around a message: several color variants and reactions.",
    imports: [
      {
        from: "bubble",
        names: ["BubbleGroup", "Bubble", "BubbleContent", "BubbleReactions"],
      },
    ],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: '"default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"',
            default: '"default"',
            description: "Color.",
          },
          {
            name: "align",
            type: '"start" | "end"',
            default: '"start"',
            description: "Which side the bubble sits on.",
          },
        ],
      },
    ],
  },
  {
    slug: "marker",
    name: "Marker",
    category: "Chat",
    icon: "bookmark",
    origin: "shadcn",
    description: "A separator or note inside a conversation, such as a date.",
    imports: [
      { from: "marker", names: ["Marker", "MarkerIcon", "MarkerContent"] },
    ],
  },
  {
    slug: "attachment",
    name: "Attachment",
    category: "Chat",
    icon: "attach_file",
    origin: "shadcn",
    description: "A file attached to a message, with upload and error states.",
    imports: [
      {
        from: "attachment",
        names: [
          "Attachment",
          "AttachmentMedia",
          "AttachmentContent",
          "AttachmentTitle",
          "AttachmentDescription",
        ],
      },
    ],
    props: [
      {
        rows: [
          {
            name: "state",
            type: '"idle" | "uploading" | "processing" | "error" | "done"',
            default: '"done"',
            description: "Upload state.",
          },
          {
            name: "orientation",
            type: '"horizontal" | "vertical"',
            default: '"horizontal"',
            description: "Layout.",
          },
        ],
      },
    ],
  },
  {
    slug: "message-scroller",
    name: "Message scroller",
    category: "Chat",
    icon: "vertical_align_bottom",
    origin: "shadcn",
    description:
      "A scrolling message list that sticks to the newest message and offers a jump-to-latest button.",
    imports: [
      {
        from: "message-scroller",
        names: [
          "MessageScroller",
          "MessageScrollerViewport",
          "MessageScrollerContent",
          "MessageScrollerItem",
          "MessageScrollerButton",
        ],
      },
    ],
    notes: [
      "Wrap the part of the app that shows messages in MessageScrollerProvider, then MessageScroller > Viewport > Content > Item. Give every Item a messageId; scrollAnchor marks the item a new turn scrolls to.",
      "The provider takes autoScroll, defaultScrollPosition (start, end, last-anchor) and scrollEdgeThreshold. useMessageScroller() gives scrollToEnd and scrollToMessage for your own buttons.",
      'MessageScrollerButton shows itself when there is more to scroll to; direction="start" is the jump-to-top one.',
    ],
  },
  {
    slug: "questionnaire",
    name: "Questionnaire",
    category: "Chat",
    icon: "quiz",
    origin: "shadcn",
    description:
      "Multi-step questions with choices, used for AI assistants that need clarification.",
    imports: [
      {
        from: "questionnaire",
        names: [
          "Questionnaire",
          "QuestionnaireItem",
          "QuestionnaireChoices",
          "QuestionnaireChoice",
        ],
      },
    ],
    notes: [
      "Questionnaire is a form: give each QuestionnaireItem a name and read the answers from FormData on submit.",
      "One item shows at a time. Mark an item required (Next waits for an answer), multiple (checkboxes), or put a QuestionnaireInput in it for a free answer.",
      'Previous, Skip, Next and Submit hide themselves when they do not apply. shortcuts="numbers" or "letters" on the root lets people answer from the keyboard.',
    ],
  },
]
