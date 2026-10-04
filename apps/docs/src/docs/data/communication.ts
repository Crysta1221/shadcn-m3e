import type { DocEntry } from "../registry"

export const communication: DocEntry[] = [
  {
    slug: "badge",
    name: "Badge",
    category: "Communication",
    icon: "notifications",
    origin: "shadcn",
    description:
      "A compact label, plus the notification badge — a 6dp dot or a 16dp counter that sits over an icon.",
    spec: "https://m3.material.io/components/badges/overview",
    imports: [{ from: "badge", names: ["Badge", "NotificationBadge"] }],
    props: [
      {
        title: "NotificationBadge",
        rows: [
          {
            name: "count",
            type: "number | string",
            description: "Omit for the small dot.",
          },
          {
            name: "max",
            type: "number",
            default: "999",
            description: "Counts above this show as {max}+.",
          },
        ],
      },
    ],
  },
  {
    slug: "progress",
    name: "Progress",
    category: "Communication",
    icon: "linear_scale",
    origin: "shadcn",
    description:
      "A linear progress indicator with a 4dp gap and end stop. Choose the flat bar or the wavy one; indeterminate runs two chasing bars.",
    spec: "https://m3.material.io/components/progress-indicators/overview",
    imports: [
      {
        from: "progress",
        names: ["Progress", "ProgressLabel", "ProgressValue"],
      },
    ],
    props: [
      {
        rows: [
          {
            name: "value",
            type: "number | null",
            description: "0–max; null means indeterminate.",
          },
          {
            name: "variant",
            type: '"flat" | "wavy"',
            default: '"flat"',
            description:
              "Wavy has a 3dp-amplitude, 40dp-wavelength wave (20dp while indeterminate).",
          },
          {
            name: "thickness",
            type: "number",
            default: "4",
            description:
              "Track height in px; the wavy amplitude scales with it.",
          },
        ],
      },
    ],
  },
  {
    slug: "circular-progress",
    name: "Circular progress",
    category: "Communication",
    icon: "progress_activity",
    origin: "m3e",
    description:
      "A circular indicator — 40dp flat or 48dp wavy — determinate or spinning.",
    spec: "https://m3.material.io/components/progress-indicators/overview",
    imports: [{ from: "circular-progress", names: ["CircularProgress"] }],
    props: [
      {
        rows: [
          {
            name: "value",
            type: "number | null",
            default: "null",
            description: "0–max; null is indeterminate.",
          },
          {
            name: "variant",
            type: '"flat" | "wavy"',
            default: '"flat"',
            description: "Wavy has a 1.6dp-amplitude, 15dp-wavelength wave.",
          },
          {
            name: "size",
            type: "number",
            description: "Diameter in px.",
          },
          {
            name: "thickness",
            type: "number",
            default: "4",
            description:
              "Stroke width in px, capped at a sixth of the diameter.",
          },
        ],
      },
    ],
  },
  {
    slug: "loading-indicator",
    name: "Loading indicator",
    category: "Communication",
    icon: "hourglass_top",
    origin: "m3e",
    description:
      "Seven Material shapes morph into one another on a spring while the whole shape rotates. Use it for waits shorter than about five seconds.",
    spec: "https://m3.material.io/components/loading-indicator/overview",
    imports: [{ from: "loading-indicator", names: ["LoadingIndicator"] }],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: '"default" | "contained"',
            default: '"default"',
            description: "Contained sits on a primary-container disc.",
          },
          {
            name: "size",
            type: "number",
            default: "48",
            description: "Container size in px.",
          },
          {
            name: "speed",
            type: "number",
            default: "1",
            description:
              "Playback speed. 1 is the spec; 2 runs the morph and rotation twice as fast; 0 pauses. It can change while mounted.",
          },
        ],
      },
    ],
  },
  {
    slug: "spinner",
    name: "Spinner",
    category: "Communication",
    icon: "sync",
    origin: "shadcn",
    description:
      "The classic Material circular indeterminate spinner: the arc grows and shrinks while the ring rotates.",
    imports: [{ from: "spinner", names: ["Spinner"] }],
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "Communication",
    icon: "hourglass_empty",
    origin: "shadcn",
    description: "A pulsing placeholder for content that is loading.",
    imports: [{ from: "skeleton", names: ["Skeleton"] }],
  },
  {
    slug: "sonner",
    name: "Snackbar",
    category: "Communication",
    icon: "chat_bubble",
    origin: "shadcn",
    description:
      "Short updates about a process, at the bottom of the screen. One at a time, no icon, one text action — and it fades and scales in on the M3E springs.",
    spec: "https://m3.material.io/components/snackbar/guidelines",
    imports: [{ from: "sonner", names: ["Toaster", "toast"] }],
    notes: [
      "Render <Toaster /> once near the root and call toast() from the same module. The API follows sonner's (toast, toast.success, toast.promise, toast.dismiss), but it is not sonner: a snackbar does not stack, slide or expand.",
      "Only one snackbar shows at a time; the rest wait in a queue. Calling toast() again with the same id updates the snackbar in place.",
      "Without an action it leaves after 4 seconds (hover or focus pauses it). With an action it stays until the user acts on it or dismisses it. On the web, also show the same information inline: auto-dismissing text is hard to read for some people.",
      "Raise it over a navigation bar or FAB with <Toaster offset={80} /> or the --snackbar-offset CSS variable. On compact screens it spans the width; from 600px it is 344–600px wide, at the bottom center.",
      "Icons are off by default (M3 advises against them). success / info / warning / error only change the announcement: error is role=alert.",
    ],
    props: [
      {
        title: "Toaster",
        rows: [
          {
            name: "position",
            type: '"bottom-center" | "bottom-left" | "bottom-right"',
            default: '"bottom-center"',
            description: "Where it sits. Keep it in one place.",
          },
          {
            name: "offset",
            type: "number | string",
            description:
              "Extra distance from the bottom (px when a number). Same as --snackbar-offset.",
          },
          {
            name: "duration",
            type: "number",
            default: "4000",
            description: "ms before a snackbar without an action leaves.",
          },
          {
            name: "closeButton",
            type: "boolean",
            default: "false",
            description: "Show the close button on every snackbar.",
          },
        ],
      },
      {
        title: "toast(message, options)",
        rows: [
          {
            name: "id",
            type: "string | number",
            description:
              "Reuse to update a showing or queued snackbar instead of adding another.",
          },
          {
            name: "action",
            type: "{ label, onClick? }",
            description:
              "The single text-button action. The snackbar stays until it is pressed (call preventDefault in onClick to keep it).",
          },
          {
            name: "actionOnNewLine",
            type: "boolean",
            default: "false",
            description: "Put a long action below the text.",
          },
          {
            name: "description",
            type: "ReactNode",
            description: "A second line of supporting text (68dp tall).",
          },
          {
            name: "duration",
            type: "number",
            description: "ms; Infinity keeps it until dismissed.",
          },
          {
            name: "closeButton",
            type: "boolean",
            description: "Show this snackbar's close button.",
          },
          {
            name: "icon",
            type: "ReactNode",
            description: "Opt-in. M3 recommends against icons in snackbars.",
          },
          {
            name: "onDismiss / onAutoClose",
            type: "(id, reason?) => void",
            description:
              "Closed by the user or the API / left because the duration ran out.",
          },
        ],
      },
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "Communication",
    icon: "chat",
    origin: "shadcn",
    description:
      "Plain tooltips: an inverse-surface label with 4dp corners that appears after a short delay.",
    spec: "https://m3.material.io/components/tooltips/overview",
    imports: [
      {
        from: "tooltip",
        names: [
          "Tooltip",
          "TooltipTrigger",
          "TooltipContent",
          "TooltipProvider",
        ],
      },
    ],
    notes: ["Wrap the app in TooltipProvider once."],
  },
  {
    slug: "alert",
    name: "Alert",
    category: "Communication",
    icon: "warning",
    origin: "shadcn",
    description: "A callout for a message the user should notice.",
    imports: [
      {
        from: "alert",
        names: ["Alert", "AlertTitle", "AlertDescription"],
      },
    ],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: '"default" | "info" | "tertiary" | "destructive"',
            default: '"default"',
            description: "Container role.",
          },
        ],
      },
    ],
  },
]
