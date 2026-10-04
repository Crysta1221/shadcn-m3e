import { h, ic, type PNode } from "../node";
import type { ListItem, P, PartDef, PartSlot } from "../types";

const DESTINATIONS = [
  { label: "Home", icon: "home" },
  { label: "Search", icon: "search" },
  { label: "Saved", icon: "favorite" },
  { label: "Settings", icon: "settings" },
];

/** every entry of a list prop is a place a tap can be sent from: `tab:0`, `tab:1`, … */
const listSlots = (items: ListItem[]): PartSlot[] => items.map((it, i) => ({ key: `tab:${i}`, label: it.label || `${i + 1}`, icon: it.icon }));

/** the search bar or view; `open` draws a view with its results showing */
function searchTree(p: P, open: boolean): PNode {
  const leading = p.s("leading") ? ic(p.s("leading")) : undefined;
  const trailing = p.s("trailing") ? ic(p.s("trailing"), { "data-tap": "icon" }) : undefined;
  const style = { width: Math.round(p.n("width")) };
  const outlined = p.s("style") === "outlined" || undefined;
  if (p.s("kind") === "bar") return h("SearchBar", { placeholder: p.s("placeholder") || undefined, leading, trailing, outlined, style });
  return h(
    "SearchView",
    { placeholder: p.s("placeholder") || undefined, leading, trailing, outlined, size: p.s("size") === "sm" ? "sm" : undefined, style, open: open || undefined },
    ...p.list("results").map((r, i) => h("SearchResult", { icon: r.icon || undefined, "data-tap": `tab:${i}` }, r.label)),
  );
}

export const navigation: PartDef[] = [
  {
    slug: "navigation-bar",
    name: "Navigation bar",
    category: "Navigation",
    icon: "bottom_navigation",
    role: "bottom",
    w: 412,
    h: 64,
    props: [
      { key: "items", label: "Destinations", kind: "list", default: DESTINATIONS, min: 3, max: 5, icons: true },
      { key: "selected", label: "Selected", kind: "number", default: 0, min: 0, max: 4, step: 1 },
      { key: "tall", label: "Tall", kind: "bool", default: false },
      { key: "layout", label: "Layout", kind: "enum", default: "vertical", options: [{ value: "vertical", label: "Stacked" }, { value: "horizontal", label: "Side by side" }] },
      { key: "elevated", label: "Elevated", kind: "bool", default: false },
      { key: "badge", label: "Badge count (0: none)", kind: "number", default: 0, min: 0, max: 99, step: 1 },
      { key: "badgeOn", label: "Badge on destination", kind: "number", default: 2, min: 1, max: 5, step: 1, when: (p) => p.n("badge") > 0 },
      { key: "width", label: "Width", kind: "number", default: 412, min: 240, max: 1280, step: 4, unit: "px" },
    ],
    slots: (p) => listSlots(p.list("items")),
    selectKey: "selected",
    tree: (p) =>
      h(
        "NavigationBar",
        {
          height: p.b("tall") ? "tall" : undefined,
          layout: p.s("layout") === "horizontal" ? "horizontal" : undefined,
          elevated: p.b("elevated") || undefined,
          style: { width: Math.round(p.n("width")) },
        },
        ...p.list("items").map((it, i) =>
          h("NavigationBarItem", { icon: it.icon || "circle", label: it.label, badge: i === p.n("badgeOn") - 1 && p.n("badge") > 0 ? p.n("badge") : undefined, active: i === p.n("selected") || undefined, "data-tap": `tab:${i}` }),
        ),
      ),
  },
  {
    slug: "app-bar",
    name: "App bar",
    category: "Navigation",
    icon: "web_asset",
    role: "top",
    w: 412,
    h: 64,
    props: [
      { key: "title", label: "Title", kind: "text", default: "Title" },
      { key: "subtitle", label: "Subtitle", kind: "text", default: "" },
      { key: "size", label: "Size", kind: "enum", default: "small", options: ["small", "medium", "large"] },
      { key: "leading", label: "Leading icon", kind: "icon", default: "menu" },
      { key: "trailing", label: "Trailing icon", kind: "icon", default: "more_vert" },
      { key: "trailing2", label: "Second trailing icon", kind: "icon", default: "" },
      { key: "centered", label: "Centered (small)", kind: "bool", default: false },
      { key: "scrolled", label: "Scrolled", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 412, min: 240, max: 1280, step: 4, unit: "px" },
    ],
    slots: (p) => [
      ...(p.s("leading") ? [{ key: "icon", label: "Leading icon", icon: p.s("leading") }] : []),
      ...(p.s("trailing") ? [{ key: "icon2", label: "Trailing icon", icon: p.s("trailing") }] : []),
      ...(p.s("trailing2") ? [{ key: "icon3", label: "Second trailing icon", icon: p.s("trailing2") }] : []),
    ],
    tree: (p) => {
      const slot = (name: string, aria: string, key: string) => (name ? h("Button", { variant: "text", size: "icon", "aria-label": aria, "data-tap": key }, ic(name)) : undefined);
      const one = slot(p.s("trailing"), "More", "icon2");
      const two = slot(p.s("trailing2"), "Action", "icon3");
      return h("AppBar", {
        size: p.s("size"),
        title: p.s("title"),
        subtitle: p.s("subtitle") || undefined,
        leading: slot(p.s("leading"), "Navigate", "icon"),
        /* two actions ride as a small row inside the bar's trailing spot */
        trailing: one && two ? h("span", { className: "flex items-center" }, one, two) : (one ?? two),
        centered: p.b("centered") || undefined,
        scrolled: p.b("scrolled") || undefined,
        style: { width: Math.round(p.n("width")) },
      });
    },
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "Navigation",
    icon: "tab",
    role: "top",
    w: 360,
    h: 48,
    props: [
      { key: "items", label: "Tabs", kind: "list", default: [{ label: "Flights" }, { label: "Trips" }, { label: "Explore" }], min: 2, max: 8, icons: true },
      { key: "selected", label: "Selected", kind: "number", default: 0, min: 0, max: 7, step: 1 },
      { key: "variant", label: "Variant", kind: "enum", default: "primary", options: ["primary", "secondary", "segmented"] },
      { key: "width", label: "Width", kind: "number", default: 360, min: 160, max: 1280, step: 4, unit: "px" },
    ],
    slots: (p) => listSlots(p.list("items")),
    selectKey: "selected",
    tree: (p) => {
      const items = p.list("items");
      /* M3 fixes up to 5 tabs; a longer row scrolls in 96dp steps instead of sharing the width */
      const scroll = items.length > 5 && items.length * 96 > p.n("width");
      return h(
        "Tabs",
        { defaultValue: `tab-${Math.min(p.n("selected"), items.length - 1) + 1}`, style: { width: Math.round(p.n("width")) } },
        h(
          "TabsList",
          { variant: p.s("variant"), className: scroll ? "overflow-x-auto scrollbar-none" : undefined },
          ...items.map((it, i) =>
            h(
              "TabsTrigger",
              { value: `tab-${i + 1}`, className: scroll ? "w-24 flex-none" : undefined, "data-tap": `tab:${i}` },
              it.icon && ic(it.icon, { "data-icon": "inline-start" }),
              it.label,
            ),
          ),
        ),
      );
    },
  },
  {
    slug: "navigation-rail",
    name: "Navigation rail",
    category: "Navigation",
    icon: "view_sidebar",
    role: "rail",
    w: 96,
    h: 400,
    props: [
      { key: "items", label: "Destinations", kind: "list", default: DESTINATIONS.slice(0, 3), min: 3, max: 7, icons: true },
      { key: "selected", label: "Selected", kind: "number", default: 0, min: 0, max: 6, step: 1 },
      { key: "expanded", label: "Expanded", kind: "bool", default: false },
      { key: "narrow", label: "Narrow (80dp)", kind: "bool", default: false },
      { key: "modal", label: "Modal (expanded over content)", kind: "bool", default: false },
      { key: "compact", label: "Compact items", kind: "bool", default: false },
      { key: "menu", label: "Menu button", kind: "bool", default: true },
      { key: "fab", label: "Compose button", kind: "bool", default: true },
      { key: "height", label: "Height", kind: "number", default: 400, min: 240, max: 800, step: 8, unit: "px" },
    ],
    slots: (p) => listSlots(p.list("items")),
    selectKey: "selected",
    tree: (p) => {
      const expanded = p.b("expanded");
      /* the menu button expands the rail (M3E's own affordance); `data-tap` lets the preview's
       *  press on it flip the rail too */
      const menu = p.b("menu") ? h("Button", { variant: "text", size: "icon", "aria-label": expanded ? "Collapse" : "Expand", "data-tap": "rail" }, ic("menu")) : null;
      const fab = p.b("fab") ? (expanded ? h("ExtendedFab", { icon: ic("edit") }, "Compose") : h("Fab", { "aria-label": "Compose" }, ic("edit"))) : null;
      const header = menu || fab ? h("NavigationRailHeader", null, menu, fab) : null;
      return h(
        "NavigationRail",
        { expanded: expanded || undefined, narrow: (!expanded && p.b("narrow")) || undefined, modal: (expanded && p.b("modal")) || undefined, compact: p.b("compact") || undefined, style: { height: Math.round(p.n("height")) } },
        header,
        ...p.list("items").map((it, i) => h("NavigationRailItem", { icon: it.icon || "circle", label: it.label, active: i === p.n("selected") || undefined, "data-tap": `tab:${i}` })),
      );
    },
  },
  {
    slug: "toolbar",
    name: "Toolbar",
    category: "Navigation",
    icon: "build",
    /* a floating toolbar hovers over the content, a docked one is a bottom bar */
    role: (p) => (p.s("kind") === "floating" ? "floatingBottom" : "bottom"),
    w: 280,
    h: 64,
    props: [
      { key: "kind", label: "Kind", kind: "enum", default: "floating", options: ["floating", "docked"] },
      { key: "color", label: "Color (floating)", kind: "enum", default: "standard", options: ["standard", "vibrant"] },
      { key: "orientation", label: "Orientation (floating)", kind: "enum", default: "horizontal", options: ["horizontal", "vertical"] },
      {
        key: "items",
        label: "Actions",
        kind: "list",
        default: [
          { label: "Undo", icon: "undo" },
          { label: "Redo", icon: "redo" },
          { label: "Bold", icon: "format_bold" },
          { label: "Italic", icon: "format_italic" },
        ],
        min: 1,
        max: 7,
        icons: true,
      },
      { key: "toggles", label: "Toggle buttons", kind: "bool", default: false },
      { key: "width", label: "Width (docked)", kind: "number", default: 412, min: 240, max: 1280, step: 4, unit: "px" },
    ],
    slots: (p) => listSlots(p.list("items")),
    tree: (p) => {
      const items = p.list("items").map((it, i): PNode => {
        const icon = ic(it.icon || "circle");
        return p.b("toggles")
          ? h("Toggle", { "aria-label": it.label, defaultPressed: i === 0 || undefined, "data-tap": `tab:${i}` }, icon)
          : h("Button", { variant: "text", size: "icon", "aria-label": it.label, "data-tap": `tab:${i}` }, icon);
      });
      if (p.s("kind") === "docked") return h("DockedToolbar", { style: { width: Math.round(p.n("width")) } }, ...items);
      return h(
        "FloatingToolbar",
        { variant: p.s("color") === "vibrant" ? "vibrant" : undefined, orientation: p.s("orientation") === "vertical" ? "vertical" : undefined },
        ...items,
      );
    },
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    category: "Navigation",
    icon: "chevron_right",
    w: 280,
    h: 24,
    props: [
      { key: "items", label: "Trail", kind: "list", default: [{ label: "Home" }, { label: "Components" }, { label: "Breadcrumb" }], min: 2, max: 7 },
      { key: "separator", label: "Separator", kind: "enum", default: "chevron", options: ["chevron", "slash"] },
      { key: "collapse", label: "Collapse the middle", kind: "bool", default: false },
    ],
    tree: (p) => {
      const trail = p.list("items");
      const last = trail.length - 1;
      const separator = () => (p.s("separator") === "slash" ? h("BreadcrumbSeparator", null, "/") : h("BreadcrumbSeparator"));
      // what a long trail shrinks to: the first crumb, an ellipsis, the last two
      const collapsed = p.b("collapse") && trail.length > 3;
      const children: PNode[] = [];
      trail.forEach((it, i) => {
        if (collapsed && i > 0 && i < last - 1) return;
        if (children.length) children.push(separator());
        children.push(h("BreadcrumbItem", null, i === last ? h("BreadcrumbPage", null, it.label) : h("BreadcrumbLink", { href: "#" }, it.label)));
        if (collapsed && i === 0) children.push(separator(), h("BreadcrumbItem", null, h("BreadcrumbEllipsis")));
      });
      return h("Breadcrumb", null, h("BreadcrumbList", null, ...children));
    },
  },
  {
    slug: "pagination",
    name: "Pagination",
    category: "Navigation",
    icon: "more_horiz",
    w: 480,
    h: 40,
    props: [
      { key: "pages", label: "Pages", kind: "number", default: 10, min: 1, max: 99, step: 1 },
      { key: "current", label: "Current page", kind: "number", default: 2, min: 1, max: 99, step: 1 },
      { key: "previous", label: "Previous label", kind: "text", default: "Previous" },
      { key: "next", label: "Next label", kind: "text", default: "Next" },
      { key: "width", label: "Width", kind: "number", default: 480, min: 240, max: 1280, step: 4, unit: "px" },
    ],
    tree: (p) => {
      const pages = Math.max(1, Math.round(p.n("pages")));
      const current = Math.min(pages, Math.max(1, Math.round(p.n("current"))));
      // the first, the last and the current page with a neighbour either side; a gap of one page is filled, a longer one is an ellipsis
      const wanted = [...new Set([1, current - 1, current, current + 1, pages])].filter((n) => n >= 1 && n <= pages).toSorted((a, b) => a - b);
      const cells: PNode[] = [];
      wanted.forEach((n, i) => {
        const before = wanted[i - 1];
        if (before !== undefined && n - before === 2) cells.push(h("PaginationItem", null, h("PaginationLink", { href: "#" }, String(n - 1))));
        else if (before !== undefined && n - before > 2) cells.push(h("PaginationItem", null, h("PaginationEllipsis")));
        cells.push(h("PaginationItem", null, h("PaginationLink", { href: "#", isActive: n === current || undefined }, String(n))));
      });
      return h(
        "Pagination",
        { style: { width: Math.round(p.n("width")) } },
        h(
          "PaginationContent",
          null,
          h("PaginationItem", null, h("PaginationPrevious", { href: "#", text: p.s("previous") || undefined })),
          ...cells,
          h("PaginationItem", null, h("PaginationNext", { href: "#", text: p.s("next") || undefined })),
        ),
      );
    },
  },
  {
    slug: "navigation-menu",
    name: "Navigation menu",
    category: "Navigation",
    icon: "menu_book",
    w: 320,
    h: 40,
    props: [
      { key: "menus", label: "Menu triggers", kind: "list", default: [{ label: "Getting started" }, { label: "Components" }], min: 0, max: 4 },
      { key: "pages", label: "Links in each menu", kind: "list", default: [{ label: "Introduction" }, { label: "Installation" }, { label: "Theming" }], min: 1, max: 6 },
      { key: "links", label: "Plain links", kind: "list", default: [{ label: "Docs" }], min: 0, max: 4 },
    ],
    open: { box: (p) => ({ w: 380, h: 44 + 12 + Math.max(1, p.list("pages").length) * 48 + 24 }) },
    tree: (p) =>
      h(
        "NavigationMenu",
        null,
        h(
          "NavigationMenuList",
          null,
          ...p.list("menus").map((m) =>
            h(
              "NavigationMenuItem",
              null,
              h("NavigationMenuTrigger", null, m.label),
              h(
                "NavigationMenuContent",
                null,
                h("ul", { className: "grid w-64 gap-1 p-2" }, ...p.list("pages").map((l) => h("li", null, h("NavigationMenuLink", { href: "#" }, l.label)))),
              ),
            ),
          ),
          ...p.list("links").map((l) => h("NavigationMenuItem", null, h("NavigationMenuLink", { href: "#" }, l.label))),
        ),
      ),
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    category: "Navigation",
    icon: "left_panel_open",
    w: 288,
    h: 400,
    props: [
      { key: "label", label: "Group label", kind: "text", default: "Application" },
      {
        key: "items",
        label: "Menu",
        kind: "list",
        default: [
          { label: "Home", icon: "home" },
          { label: "Inbox", icon: "inbox" },
          { label: "Settings", icon: "settings" },
        ],
        min: 1,
        max: 8,
        icons: true,
      },
      { key: "selected", label: "Selected", kind: "number", default: 0, min: 0, max: 7, step: 1 },
      { key: "size", label: "Item size", kind: "enum", default: "default", options: ["default", "sm", "lg"] },
      { key: "width", label: "Width", kind: "number", default: 288, min: 200, max: 400, step: 4, unit: "px" },
      { key: "height", label: "Height", kind: "number", default: 400, min: 200, max: 800, step: 8, unit: "px" },
    ],
    slots: (p) => listSlots(p.list("items")),
    selectKey: "selected",
    // collapsible="none" is the static sidebar (no fixed container, no sheet); the provider is boxed so nothing escapes
    tree: (p) => {
      const width = Math.round(p.n("width"));
      const size = p.s("size");
      return h(
        "SidebarProvider",
        { className: "min-h-0 overflow-hidden rounded-2xl border border-outline-variant", style: { width, height: Math.round(p.n("height")) } },
        h(
          "Sidebar",
          { collapsible: "none", style: { width } },
          h(
            "SidebarContent",
            null,
            h(
              "SidebarGroup",
              null,
              p.s("label") ? h("SidebarGroupLabel", null, p.s("label")) : null,
              h(
                "SidebarMenu",
                null,
                ...p.list("items").map((it, i) => {
                  const active = i === p.n("selected");
                  return h(
                    "SidebarMenuItem",
                    null,
                    h("SidebarMenuButton", { isActive: active || undefined, size: size === "default" ? undefined : size, "data-tap": `tab:${i}` }, it.icon ? ic(it.icon, active ? { fill: true } : undefined) : null, it.label),
                  );
                }),
              ),
            ),
          ),
        ),
      );
    },
  },
  {
    slug: "search",
    name: "Search",
    category: "Navigation",
    icon: "search",
    w: 360,
    h: 56,
    props: [
      { key: "kind", label: "Kind", kind: "enum", default: "view", options: [{ value: "view", label: "Search view" }, { value: "bar", label: "Search bar" }] },
      { key: "style", label: "Style", kind: "enum", default: "elevated", options: ["elevated", "outlined"] },
      { key: "placeholder", label: "Placeholder", kind: "text", default: "Search songs" },
      { key: "leading", label: "Leading icon", kind: "icon", default: "search" },
      { key: "trailing", label: "Trailing icon", kind: "icon", default: "mic" },
      { key: "size", label: "Size (view)", kind: "enum", default: "default", options: ["default", "sm"] },
      {
        key: "results",
        label: "Suggestions (view)",
        kind: "list",
        default: [
          { label: "Recent search", icon: "history" },
          { label: "Another recent search", icon: "history" },
          { label: "Suggestion", icon: "search" },
        ],
        min: 0,
        max: 6,
        icons: true,
      },
      { key: "width", label: "Width", kind: "number", default: 360, min: 200, max: 640, step: 4, unit: "px" },
    ],
    // the results hang off the bar when it is open, so the canvas draws it open in a box that has room for them
    open: { box: (p) => ({ w: p.n("width"), h: p.s("kind") === "bar" ? 56 : 56 + 8 + Math.max(p.list("results").length, 1) * 56 + 16 }) },
    slots: (p) => [...(p.s("trailing") ? [{ key: "icon", label: "Trailing icon", icon: p.s("trailing") }] : []), ...(p.s("kind") === "view" ? listSlots(p.list("results")) : [])],
    view: (p) => searchTree(p, true),
    tree: (p) => searchTree(p, false),
  },
  {
    slug: "command",
    name: "Command",
    category: "Navigation",
    icon: "keyboard_command_key",
    w: 384,
    h: 220,
    props: [
      { key: "placeholder", label: "Placeholder", kind: "text", default: "Type a command or search..." },
      { key: "heading", label: "Group heading", kind: "text", default: "Suggestions" },
      {
        key: "items",
        label: "Commands",
        kind: "list",
        default: [
          { label: "Calendar", icon: "calendar_month" },
          { label: "Search emoji", icon: "mood" },
          { label: "Calculator", icon: "calculate" },
        ],
        min: 1,
        max: 8,
        icons: true,
      },
      { key: "width", label: "Width", kind: "number", default: 384, min: 240, max: 640, step: 4, unit: "px" },
    ],
    slots: (p) => listSlots(p.list("items")),
    tree: (p) =>
      h(
        "Command",
        { className: "h-auto border border-outline-variant", style: { width: Math.round(p.n("width")) } },
        h("CommandInput", { placeholder: p.s("placeholder") }),
        h(
          "CommandList",
          null,
          h("CommandEmpty", null, "No results found."),
          h("CommandGroup", { heading: p.s("heading") || undefined }, ...p.list("items").map((it, i) => h("CommandItem", { "data-tap": `tab:${i}` }, it.icon ? ic(it.icon) : null, it.label))),
        ),
      ),
  },
];
