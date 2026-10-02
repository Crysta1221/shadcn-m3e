import type { DocEntry } from "../registry"

/** Navigation, menus and pickers */
export const navigation: DocEntry[] = [
  {
    slug: "navigation-bar",
    name: "Navigation bar",
    category: "Navigation",
    icon: "bottom_navigation",
    origin: "m3e",
    description:
      "Bottom navigation for compact windows: three to five destinations, each with an icon and label. The active one gets a filled icon and a pill indicator that grows in on the spatial spring.",
    spec: "https://m3.material.io/components/navigation-bar/overview",
    imports: [
      { from: "navigation", names: ["NavigationBar", "NavigationBarItem"] },
    ],
    notes: [
      "Pass a Material Symbols name as icon; it is outlined and fills while the item is active.",
      "Use render={<Link … />} on an item to make it a router link.",
    ],
    props: [
      {
        title: "NavigationBar",
        rows: [
          {
            name: "layout",
            type: '"vertical" | "horizontal"',
            default: '"vertical"',
            description:
              "Horizontal puts the icon and label side by side, for medium windows.",
          },
          {
            name: "height",
            type: '"default" | "tall"',
            default: '"default"',
            description: "64dp or 80dp.",
          },
          {
            name: "elevated",
            type: "boolean",
            default: "false",
            description: "Elevation 2.",
          },
        ],
      },
      {
        title: "NavigationBarItem / NavigationRailItem",
        rows: [
          {
            name: "icon",
            type: "string | ReactNode",
            description: "Material Symbols name or a node.",
          },
          {
            name: "label",
            type: "ReactNode",
            description: "Destination name.",
          },
          {
            name: "active",
            type: "boolean",
            description: "Marks the current destination.",
          },
          {
            name: "badge",
            type: "boolean | number | string",
            description:
              "true shows a dot; a number or string shows a counter.",
          },
        ],
      },
    ],
  },
  {
    slug: "navigation-rail",
    name: "Navigation rail",
    category: "Navigation",
    icon: "view_sidebar",
    origin: "m3e",
    description:
      "Side navigation for medium and large windows. Collapsed (96dp) it shows icons over labels; expanded (220–360dp) it shows wide pill items and can hold section headings.",
    spec: "https://m3.material.io/components/navigation-rail/overview",
    imports: [
      {
        from: "navigation",
        names: [
          "NavigationRail",
          "NavigationRailHeader",
          "NavigationRailItem",
          "NavigationRailSection",
        ],
      },
    ],
    notes: [
      "This documentation site's component list is an expanded, compact navigation rail.",
      "Put a menu button or FAB in NavigationRailHeader.",
    ],
    props: [
      {
        rows: [
          {
            name: "expanded",
            type: "boolean",
            default: "false",
            description: "220dp wide with horizontal items.",
          },
          {
            name: "narrow",
            type: "boolean",
            default: "false",
            description: "80dp instead of 96dp when collapsed.",
          },
          {
            name: "modal",
            type: "boolean",
            default: "false",
            description: "Expanded rail floating over content.",
          },
          {
            name: "compact",
            type: "boolean",
            default: "false",
            description: "40dp items, for long lists.",
          },
        ],
      },
    ],
  },
  {
    slug: "app-bar",
    name: "App bar",
    category: "Navigation",
    icon: "web_asset",
    origin: "m3e",
    description:
      "The top app bar in small (64dp), medium (112dp) and large (120dp) sizes, with optional subtitle. It turns surface-container with elevation 2 once content scrolls under it.",
    spec: "https://m3.material.io/components/app-bars/overview",
    imports: [{ from: "app-bar", names: ["AppBar", "useScrolled"] }],
    props: [
      {
        rows: [
          {
            name: "size",
            type: '"small" | "medium" | "large"',
            default: '"small"',
            description: "Bar size.",
          },
          {
            name: "title / subtitle",
            type: "ReactNode",
            description: "Headline and optional supporting line.",
          },
          {
            name: "leading / trailing",
            type: "ReactNode",
            description: "Navigation icon and actions.",
          },
          {
            name: "scrolled",
            type: "boolean",
            description:
              "Content is scrolling under the bar. useScrolled() reports it.",
          },
          {
            name: "centered",
            type: "boolean",
            description: "Center the title of a small bar.",
          },
        ],
      },
    ],
  },
  {
    slug: "toolbar",
    name: "Toolbar",
    category: "Navigation",
    icon: "build",
    origin: "m3e",
    description:
      "Floating and docked toolbars for actions related to the current content. Icon buttons and toggles inside pick up the toolbar's colors.",
    spec: "https://m3.material.io/components/toolbars/overview",
    imports: [{ from: "toolbar", names: ["FloatingToolbar", "DockedToolbar"] }],
    props: [
      {
        title: "FloatingToolbar",
        rows: [
          {
            name: "variant",
            type: '"standard" | "vibrant"',
            default: '"standard"',
            description: "surface-container, or primary-container.",
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
    slug: "tabs",
    name: "Tabs",
    category: "Navigation",
    icon: "tab",
    origin: "shadcn",
    description:
      "Organize content into views. The indicator slides between tabs; the segmented variant is a sliding pill.",
    spec: "https://m3.material.io/components/tabs/overview",
    imports: [
      {
        from: "tabs",
        names: ["Tabs", "TabsList", "TabsTrigger", "TabsContent"],
      },
    ],
    props: [
      {
        title: "TabsList",
        rows: [
          {
            name: "variant",
            type: '"default" | "primary" | "secondary" | "line" | "segmented"',
            default: '"default"',
            description:
              "Primary has a short 3dp indicator; secondary spans the tab; segmented is a pill.",
          },
        ],
      },
    ],
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    category: "Navigation",
    icon: "chevron_right",
    origin: "shadcn",
    description: "The path to the current page.",
    imports: [
      {
        from: "breadcrumb",
        names: [
          "Breadcrumb",
          "BreadcrumbList",
          "BreadcrumbItem",
          "BreadcrumbLink",
          "BreadcrumbPage",
          "BreadcrumbSeparator",
        ],
      },
    ],
  },
  {
    slug: "pagination",
    name: "Pagination",
    category: "Navigation",
    icon: "more_horiz",
    origin: "shadcn",
    description: "Page navigation with previous and next links.",
    imports: [
      {
        from: "pagination",
        names: [
          "Pagination",
          "PaginationContent",
          "PaginationItem",
          "PaginationLink",
          "PaginationPrevious",
          "PaginationNext",
          "PaginationEllipsis",
        ],
      },
    ],
  },
  {
    slug: "navigation-menu",
    name: "Navigation menu",
    category: "Navigation",
    icon: "menu_book",
    origin: "shadcn",
    description: "A row of links and menus for site navigation.",
    imports: [
      {
        from: "navigation-menu",
        names: [
          "NavigationMenu",
          "NavigationMenuList",
          "NavigationMenuItem",
          "NavigationMenuTrigger",
          "NavigationMenuContent",
          "NavigationMenuLink",
        ],
      },
    ],
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    category: "Navigation",
    icon: "left_panel_open",
    origin: "shadcn",
    description:
      "An app sidebar that collapses to icons. Items are the M3 navigation drawer's 56dp pills, secondary-container when active.",
    spec: "https://m3.material.io/components/navigation-drawer/overview",
    imports: [
      {
        from: "sidebar",
        names: [
          "SidebarProvider",
          "Sidebar",
          "SidebarContent",
          "SidebarGroup",
          "SidebarGroupLabel",
          "SidebarMenu",
          "SidebarMenuItem",
          "SidebarMenuButton",
          "SidebarInset",
          "SidebarTrigger",
        ],
      },
    ],
    showcase: "sidebar-layout",
  },
  {
    slug: "search",
    name: "Search",
    category: "Navigation",
    icon: "search",
    origin: "m3e",
    description:
      "A search bar and its view. The docked view grows out of the bar into a 28dp-cornered container with a divider and results; the full-screen view covers the window with a 72dp header.",
    spec: "https://m3.material.io/components/search/overview",
    imports: [
      { from: "search", names: ["SearchBar", "SearchView", "SearchResult"] },
    ],
    props: [
      {
        title: "SearchView",
        rows: [
          {
            name: "variant",
            type: '"docked" | "fullscreen"',
            default: '"docked"',
            description: "How the view opens.",
          },
          {
            name: "value / onValueChange",
            type: "string / (v) => void",
            description: "The query.",
          },
          {
            name: "open / onOpenChange",
            type: "boolean / (v) => void",
            description: "Whether the results are showing.",
          },
          {
            name: "leading / trailing",
            type: "ReactNode",
            description:
              "Icons in the header; a clear button is added for you.",
          },
          {
            name: "onSubmit",
            type: "(value: string) => void",
            description: "Called on Enter.",
          },
        ],
      },
    ],
  },
  {
    slug: "command",
    name: "Command",
    category: "Navigation",
    icon: "keyboard_command_key",
    origin: "shadcn",
    description: "A searchable command palette, inline or in a dialog.",
    imports: [
      {
        from: "command",
        names: [
          "Command",
          "CommandInput",
          "CommandList",
          "CommandEmpty",
          "CommandGroup",
          "CommandItem",
          "CommandShortcut",
        ],
      },
    ],
  },
  {
    slug: "dropdown-menu",
    name: "Dropdown menu",
    category: "Menus",
    icon: "arrow_drop_down",
    origin: "shadcn",
    description:
      "A menu of actions opened from a button. Rounded 12dp on surface-container-low; the selected item turns tertiary-container.",
    spec: "https://m3.material.io/components/menus/overview",
    imports: [
      {
        from: "dropdown-menu",
        names: [
          "DropdownMenu",
          "DropdownMenuTrigger",
          "DropdownMenuContent",
          "DropdownMenuItem",
          "DropdownMenuCheckboxItem",
          "DropdownMenuSeparator",
          "DropdownMenuLabel",
          "DropdownMenuShortcut",
        ],
      },
    ],
  },
  {
    slug: "context-menu",
    name: "Context menu",
    category: "Menus",
    icon: "ads_click",
    origin: "shadcn",
    description: "A menu opened by right-click or long-press.",
    imports: [
      {
        from: "context-menu",
        names: [
          "ContextMenu",
          "ContextMenuTrigger",
          "ContextMenuContent",
          "ContextMenuItem",
          "ContextMenuSeparator",
        ],
      },
    ],
  },
  {
    slug: "menubar",
    name: "Menubar",
    category: "Menus",
    icon: "menu",
    origin: "shadcn",
    description: "A desktop-style bar of menus.",
    imports: [
      {
        from: "menubar",
        names: [
          "Menubar",
          "MenubarMenu",
          "MenubarTrigger",
          "MenubarContent",
          "MenubarItem",
          "MenubarSeparator",
          "MenubarShortcut",
        ],
      },
    ],
  },
  {
    slug: "calendar",
    name: "Calendar",
    category: "Pickers",
    icon: "calendar_month",
    origin: "shadcn",
    description:
      "A month view for picking a date or a range: circular days, a primary-outlined today, secondary-container range bands. For the complete date picker (header, year list, text input, OK / Cancel) see Date picker.",
    spec: "https://m3.material.io/components/date-pickers/overview",
    imports: [{ from: "calendar", names: ["Calendar"] }],
    notes: ["Built on react-day-picker; all its props work."],
  },
  {
    slug: "date-picker",
    name: "Date picker",
    category: "Pickers",
    icon: "edit_calendar",
    origin: "m3e",
    description:
      "Pick a date or a range: docked under a text field, or as a modal with a header, a year list and a text input. 40dp circular days, a primary-outlined today, secondary-container ranges.",
    spec: "https://m3.material.io/components/date-pickers/overview",
    imports: [
      { from: "date-picker", names: ["DatePicker", "DatePickerModal"] },
    ],
    notes: [
      "DatePicker is docked: type mm/dd/yyyy or open the calendar. It is controlled with value / onValueChange, or uncontrolled with defaultValue.",
      "DatePickerModal opens from trigger (any element) or from open / onOpenChange. The date is only handed over when OK is pressed, through onConfirm.",
      'Use mode="range" for a start and an end date; value and onConfirm then take { from, to }.',
      "The calendar underneath is Calendar (react-day-picker), so its disabled matchers work: pass disabled to the modal or disabledDates to the docked picker.",
    ],
    props: [
      {
        title: "DatePickerModal",
        rows: [
          {
            name: "mode",
            type: '"single" | "range"',
            default: '"single"',
            description: "One date, or a start and an end date.",
          },
          {
            name: "value",
            type: "Date | { from?: Date; to?: Date }",
            description: "The date shown when it opens.",
          },
          {
            name: "onConfirm",
            type: "(date: Date) => void | (range: { from: Date; to: Date }) => void",
            description: "Called with the choice when OK is pressed.",
          },
          {
            name: "trigger",
            type: "ReactElement",
            description: "Element that opens the picker.",
          },
          {
            name: "open / defaultOpen / onOpenChange",
            type: "boolean / boolean / (open: boolean) => void",
            description: "Control the dialog yourself.",
          },
          {
            name: "title",
            type: "string",
            default: '"Select date"',
            description: "The small label in the header.",
          },
          {
            name: "locale",
            type: "string",
            description: "BCP 47 tag for month and weekday names, e.g. ja-JP.",
          },
          {
            name: "defaultView",
            type: '"calendar" | "input"',
            default: '"calendar"',
            description: "Open on the text input.",
          },
          {
            name: "startYear / endYear",
            type: "number",
            default: "1900 / 2100",
            description: "Bounds of the year list.",
          },
        ],
      },
      {
        title: "DatePicker",
        rows: [
          {
            name: "value / defaultValue / onValueChange",
            type: "Date | undefined",
            description: "The chosen date; undefined when the field is empty.",
          },
          {
            name: "label / placeholder",
            type: "string",
            default: '"Date" / "mm/dd/yyyy"',
            description: "Text of the field.",
          },
          {
            name: "disabledDates",
            type: "Matcher | Matcher[]",
            description: "Dates the calendar will not let you pick.",
          },
        ],
      },
    ],
  },
  {
    slug: "time-picker",
    name: "Time picker",
    category: "Pickers",
    icon: "schedule",
    origin: "m3e",
    description:
      "Pick a time on a dial or by typing. Choosing the hour moves on to the minutes; the handle takes the short way round.",
    spec: "https://m3.material.io/components/time-pickers/overview",
    imports: [{ from: "time-picker", names: ["TimePicker"] }],
    props: [
      {
        rows: [
          {
            name: "value / defaultValue",
            type: "{ hours: number; minutes: number }",
            description: "Time in 24-hour form.",
          },
          {
            name: "onValueChange",
            type: "(v: TimeValue) => void",
            description: "Called on every change.",
          },
          {
            name: "hour24",
            type: "boolean",
            default: "false",
            description:
              "24-hour dial (inner ring for 13–00) instead of AM/PM.",
          },
          {
            name: "mode / onModeChange",
            type: '"dial" | "input"',
            default: '"dial"',
            description: "Dial or keyboard entry.",
          },
          {
            name: "onCancel / onConfirm",
            type: "() => void / (v) => void",
            description: "Shows Cancel and OK when given.",
          },
        ],
      },
    ],
  },
]
