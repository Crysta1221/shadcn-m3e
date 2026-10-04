import { h, ic } from "../node";
import { around, type PartDef } from "../types";

const BUTTON_VARIANTS = ["filled", "tonal", "elevated", "outlined", "text"];

export const containment: PartDef[] = [
  {
    slug: "card",
    name: "Card",
    category: "Containment",
    icon: "credit_card",
    w: 280,
    h: 120,
    props: [
      { key: "title", label: "Title", kind: "text", default: "Card title" },
      { key: "description", label: "Description", kind: "text", default: "Supporting text for the card.", multiline: true },
      { key: "variant", label: "Variant", kind: "enum", default: "filled", options: ["filled", "elevated", "outlined"] },
      { key: "action", label: "Action button", kind: "text", default: "" },
      { key: "width", label: "Width", kind: "number", default: 280, min: 160, max: 520, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h(
        "Card",
        { variant: p.s("variant"), style: { width: Math.round(p.n("width")) } },
        h("CardHeader", null, h("CardTitle", null, p.s("title")), p.s("description") && h("CardDescription", null, p.s("description"))),
        p.s("action") && h("CardFooter", null, h("Button", { variant: "text", size: "sm" }, p.s("action"))),
      ),
  },
  {
    slug: "item",
    name: "List item",
    category: "Containment",
    icon: "list_alt",
    w: 280,
    h: 64,
    props: [
      { key: "title", label: "Title", kind: "text", default: "Inbox" },
      { key: "description", label: "Supporting text", kind: "text", default: "12 new messages" },
      { key: "icon", label: "Leading icon", kind: "icon", default: "inbox" },
      { key: "variant", label: "Variant", kind: "enum", default: "default", options: ["default", "outline", "muted", "segmented"] },
      { key: "width", label: "Width", kind: "number", default: 280, min: 160, max: 520, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h(
        "Item",
        { variant: p.s("variant") === "default" ? undefined : p.s("variant"), style: { width: Math.round(p.n("width")) } },
        p.s("icon") && h("ItemMedia", { variant: "icon" }, ic(p.s("icon"))),
        h("ItemContent", null, h("ItemTitle", null, p.s("title")), p.s("description") && h("ItemDescription", null, p.s("description"))),
      ),
  },
  {
    slug: "dialog",
    name: "Dialog",
    category: "Containment",
    icon: "web_asset",
    w: 360,
    h: 232,
    props: [
      { key: "style", label: "Style", kind: "enum", default: "basic", options: [{ value: "basic", label: "Basic" }, { value: "fullscreen", label: "Full-screen" }] },
      { key: "icon", label: "Icon", kind: "icon", default: "", when: (p) => p.s("style") === "basic" },
      { key: "title", label: "Title", kind: "text", default: "Reset settings?" },
      { key: "description", label: "Description", kind: "text", default: "This will reset your app preferences back to their default settings.", multiline: true },
      { key: "dismiss", label: "Dismiss action", kind: "text", default: "Cancel", when: (p) => p.s("style") === "basic" },
      { key: "confirm", label: "Confirm action", kind: "text", default: "Accept" },
      { key: "stacked", label: "Stacked actions", kind: "bool", default: false, when: (p) => p.s("style") === "basic" },
      { key: "closeButton", label: "Close button", kind: "bool", default: false, when: (p) => p.s("style") === "basic" },
      { key: "width", label: "Width", kind: "number", default: 412, min: 280, max: 1280, step: 4, unit: "px", when: (p) => p.s("style") === "fullscreen" },
      { key: "height", label: "Height", kind: "number", default: 640, min: 320, max: 900, step: 4, unit: "px", when: (p) => p.s("style") === "fullscreen" },
    ],
    // a basic dialog is only its card: the box is a screen the card floats in, and the part
    // stands where the card lands (fit). A full-screen one fills a screen of its own size.
    open: { box: (p) => (p.s("style") === "fullscreen" ? { w: p.n("width"), h: p.n("height") } : { w: 560, h: 400 }), trigger: "hide", fit: true },
    tree: (p) => {
      const trigger = h("DialogTrigger", { render: h("Button", { variant: "tonal" }) }, "Open dialog");
      if (p.s("style") === "fullscreen") {
        return h(
          "Dialog",
          null,
          trigger,
          h(
            "DialogContent",
            { variant: "fullscreen" },
            h(
              "DialogTopBar",
              { divider: true },
              h("DialogClose", { render: h("Button", { variant: "text", size: "icon", "aria-label": "Close" }) }, ic("close")),
              h("DialogTitle", null, p.s("title")),
              p.s("confirm") && h("DialogClose", { render: h("Button", { variant: "text" }) }, p.s("confirm")),
            ),
            h("DialogBody", null, p.s("description") && h("DialogDescription", null, p.s("description"))),
          ),
        );
      }
      return h(
        "Dialog",
        null,
        trigger,
        h(
          "DialogContent",
          { showCloseButton: p.b("closeButton") ? undefined : false },
          p.s("icon") && h("DialogIcon", null, ic(p.s("icon"))),
          h("DialogHeader", null, h("DialogTitle", null, p.s("title")), p.s("description") && h("DialogDescription", null, p.s("description"))),
          (p.s("dismiss") || p.s("confirm")) &&
            h(
              "DialogFooter",
              { stacked: p.b("stacked") || undefined },
              p.s("dismiss") && h("DialogClose", { render: h("Button", { variant: "text" }) }, p.s("dismiss")),
              p.s("confirm") && h("DialogClose", { render: h("Button", { variant: "text" }) }, p.s("confirm")),
            ),
        ),
      );
    },
  },
  {
    slug: "alert-dialog",
    name: "Alert dialog",
    category: "Containment",
    icon: "report",
    w: 320,
    h: 200,
    props: [
      { key: "icon", label: "Icon", kind: "icon", default: "" },
      { key: "title", label: "Title", kind: "text", default: "Delete your account?" },
      { key: "description", label: "Description", kind: "text", default: "This action cannot be undone.", multiline: true },
      { key: "cancel", label: "Cancel action", kind: "text", default: "Cancel" },
      { key: "action", label: "Confirm action", kind: "text", default: "Delete" },
      { key: "size", label: "Size", kind: "enum", default: "default", options: ["default", "sm"] },
    ],
    open: { box: () => ({ w: 560, h: 360 }), trigger: "hide", fit: true },
    tree: (p) =>
      h(
        "AlertDialog",
        null,
        h("AlertDialogTrigger", { render: h("Button", { variant: "outlined" }) }, "Delete account"),
        h(
          "AlertDialogContent",
          { size: p.s("size") === "default" ? undefined : p.s("size") },
          h(
            "AlertDialogHeader",
            null,
            p.s("icon") && h("AlertDialogMedia", null, ic(p.s("icon"))),
            h("AlertDialogTitle", null, p.s("title")),
            p.s("description") && h("AlertDialogDescription", null, p.s("description")),
          ),
          h("AlertDialogFooter", null, p.s("cancel") && h("AlertDialogCancel", null, p.s("cancel")), p.s("action") && h("AlertDialogAction", null, p.s("action"))),
        ),
      ),
  },
  {
    slug: "sheet",
    name: "Sheet",
    category: "Containment",
    icon: "side_navigation",
    w: 300,
    h: 480,
    props: [
      { key: "side", label: "Side", kind: "enum", default: "right", options: ["right", "left", "bottom", "top"] },
      { key: "title", label: "Title", kind: "text", default: "Filters" },
      { key: "description", label: "Description", kind: "text", default: "Narrow down the results.", multiline: true },
      { key: "footer", label: "Save and Cancel", kind: "bool", default: false },
    ],
    // the sheet docks to an edge of the screen the box stands in for; the part is the sheet itself
    open: { box: () => ({ w: 412, h: 560 }), trigger: "hide", fit: true },
    tree: (p) =>
      h(
        "Sheet",
        null,
        h("SheetTrigger", { render: h("Button", { variant: "tonal" }) }, "Open sheet"),
        h(
          "SheetContent",
          { side: p.s("side") === "right" ? undefined : p.s("side") },
          h("SheetHeader", null, h("SheetTitle", null, p.s("title")), p.s("description") && h("SheetDescription", null, p.s("description"))),
          p.b("footer") && h("SheetFooter", null, h("SheetClose", { render: h("Button") }, "Save"), h("SheetClose", { render: h("Button", { variant: "outlined" }) }, "Cancel")),
        ),
      ),
  },
  {
    slug: "side-sheet",
    name: "Side sheet",
    category: "Containment",
    icon: "right_panel_open",
    w: 640,
    h: 320,
    props: [
      { key: "title", label: "Title", kind: "text", default: "Filters" },
      { key: "content", label: "Content", kind: "text", default: "Narrow the messages down by sender, date or label.", multiline: true },
      { key: "side", label: "Side", kind: "enum", default: "right", options: ["right", "left"] },
      { key: "detached", label: "Detached", kind: "bool", default: false },
      { key: "closeButton", label: "Close button", kind: "bool", default: true },
      { key: "footer", label: "Apply and Cancel", kind: "bool", default: true },
      { key: "width", label: "Sheet width", kind: "number", default: 360, min: 256, max: 400, step: 4, unit: "px" },
      { key: "height", label: "Frame height", kind: "number", default: 320, min: 200, max: 560, step: 8, unit: "px" },
    ],
    tree: (p) => {
      const width = Math.round(p.n("width"));
      return h(
        "div",
        { className: "flex overflow-hidden rounded-lg border border-outline-variant", style: { width: width + 280, height: Math.round(p.n("height")) } },
        h(
          "div",
          { className: "flex min-w-0 flex-1 flex-col items-start gap-3 p-6" },
          h("h3", { className: "text-title-medium text-on-surface" }, "Inbox"),
          h("p", { className: "text-body-medium text-on-surface-variant" }, "The list keeps its place; only its width changes."),
        ),
        h(
          "SideSheet",
          { side: p.s("side") === "right" ? undefined : p.s("side"), detached: p.b("detached") || undefined, width: width === 360 ? undefined : width },
          // onClose is a handler the canvas cannot run, so the close button is a child of the header
          h("SideSheetHeader", { title: p.s("title") }, p.b("closeButton") && h("Button", { variant: "ghost", size: "icon", "aria-label": "Close", className: "text-on-surface-variant" }, ic("close"))),
          h("SideSheetContent", null, h("p", null, p.s("content"))),
          p.b("footer") && h("SideSheetFooter", null, h("Button", null, "Apply"), h("Button", { variant: "outlined" }, "Cancel")),
        ),
      );
    },
  },
  {
    slug: "drawer",
    name: "Drawer",
    category: "Containment",
    icon: "vertical_align_bottom",
    w: 412,
    h: 200,
    props: [
      { key: "title", label: "Title", kind: "text", default: "Share" },
      { key: "description", label: "Description", kind: "text", default: "Choose where to send this.", multiline: true },
      { key: "close", label: "Close action", kind: "text", default: "Close" },
      { key: "swipeHandle", label: "Swipe handle", kind: "bool", default: true },
    ],
    open: { box: () => ({ w: 412, h: 560 }), trigger: "hide", fit: true },
    tree: (p) =>
      h(
        "Drawer",
        { showSwipeHandle: p.b("swipeHandle") || undefined },
        h("DrawerTrigger", { render: h("Button", { variant: "tonal" }) }, "Open drawer"),
        h(
          "DrawerContent",
          null,
          h("DrawerHeader", null, h("DrawerTitle", null, p.s("title")), p.s("description") && h("DrawerDescription", null, p.s("description"))),
          p.s("close") && h("DrawerFooter", null, h("DrawerClose", { render: h("Button", { variant: "text" }) }, p.s("close"))),
        ),
      ),
  },
  {
    slug: "popover",
    name: "Popover",
    category: "Containment",
    icon: "comment",
    w: 120,
    h: 40,
    props: [
      { key: "trigger", label: "Button label", kind: "text", default: "Open popover" },
      { key: "variant", label: "Button variant", kind: "enum", default: "outlined", options: BUTTON_VARIANTS },
      { key: "title", label: "Title", kind: "text", default: "Dimensions" },
      { key: "description", label: "Description", kind: "text", default: "Set the size of the layer.", multiline: true },
      { key: "side", label: "Side", kind: "enum", default: "bottom", options: ["bottom", "top", "right", "left"] },
    ],
    open: { box: (p) => around(p.s("side"), 300, 190, 120, 40) },
    tree: (p) =>
      h(
        "Popover",
        null,
        h("PopoverTrigger", { render: h("Button", { variant: p.s("variant") }) }, p.s("trigger")),
        h(
          "PopoverContent",
          { side: p.s("side") === "bottom" ? undefined : p.s("side") },
          h("PopoverHeader", null, h("PopoverTitle", null, p.s("title")), p.s("description") && h("PopoverDescription", null, p.s("description"))),
        ),
      ),
  },
  {
    slug: "hover-card",
    name: "Hover card",
    category: "Containment",
    icon: "ads_click",
    w: 72,
    h: 24,
    props: [
      { key: "trigger", label: "Link text", kind: "text", default: "@material" },
      { key: "avatar", label: "Avatar letter", kind: "text", default: "M" },
      { key: "title", label: "Title", kind: "text", default: "Material Design" },
      { key: "description", label: "Description", kind: "text", default: "Google's open-source design system.", multiline: true },
      { key: "side", label: "Side", kind: "enum", default: "bottom", options: ["bottom", "top", "right", "left"] },
    ],
    open: { box: (p) => around(p.s("side"), 280, 150, 90, 24) },
    tree: (p) =>
      h(
        "HoverCard",
        null,
        h("HoverCardTrigger", { render: h("a", { href: "#", className: "text-primary underline" }, p.s("trigger")) }),
        h(
          "HoverCardContent",
          { className: "flex gap-3", side: p.s("side") === "bottom" ? undefined : p.s("side") },
          p.s("avatar") && h("Avatar", null, h("AvatarFallback", null, p.s("avatar"))),
          h("div", null, h("p", { className: "text-title-small text-on-surface" }, p.s("title")), p.s("description") && h("p", { className: "text-body-small text-on-surface-variant" }, p.s("description"))),
        ),
      ),
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "Containment",
    icon: "expand_circle_down",
    w: 360,
    h: 220,
    props: [
      {
        key: "items",
        label: "Items",
        kind: "list",
        default: [{ label: "What is M3 Expressive?" }, { label: "Where do the values come from?" }, { label: "Can I use it with shadcn?" }],
        min: 1,
        max: 8,
      },
      { key: "content", label: "Panel text", kind: "text", default: "An expansion of Material 3 with richer shapes, springier motion and bolder type.", multiline: true },
      { key: "openFirst", label: "First item open", kind: "bool", default: true },
      { key: "multiple", label: "Several open at once", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 360, min: 200, max: 640, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h(
        "Accordion",
        { defaultValue: p.b("openFirst") ? ["item-1"] : undefined, multiple: p.b("multiple") || undefined, style: { width: Math.round(p.n("width")) } },
        ...p.list("items").map((item, i) => h("AccordionItem", { value: `item-${i + 1}` }, h("AccordionTrigger", null, item.label), h("AccordionContent", null, p.s("content")))),
      ),
  },
  {
    slug: "collapsible",
    name: "Collapsible",
    category: "Containment",
    icon: "unfold_less",
    w: 256,
    h: 112,
    props: [
      { key: "trigger", label: "Button label", kind: "text", default: "Toggle details" },
      { key: "variant", label: "Button variant", kind: "enum", default: "tonal", options: BUTTON_VARIANTS },
      { key: "content", label: "Content", kind: "text", default: "Here are the details that were hidden.", multiline: true },
      { key: "open", label: "Open", kind: "bool", default: true },
      { key: "width", label: "Width", kind: "number", default: 256, min: 160, max: 520, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h(
        "Collapsible",
        { defaultOpen: p.b("open") || undefined, className: "flex flex-col gap-2", style: { width: Math.round(p.n("width")) } },
        h("CollapsibleTrigger", { render: h("Button", { variant: p.s("variant") }) }, p.s("trigger")),
        h("CollapsibleContent", { className: "rounded-md bg-surface-container p-3 text-body-medium text-on-surface" }, p.s("content")),
      ),
  },
  {
    slug: "separator",
    name: "Separator",
    category: "Containment",
    icon: "horizontal_rule",
    w: 280,
    h: 1,
    props: [
      { key: "orientation", label: "Orientation", kind: "enum", default: "horizontal", options: ["horizontal", "vertical"] },
      { key: "length", label: "Length", kind: "number", default: 280, min: 16, max: 640, step: 4, unit: "px" },
      { key: "thickness", label: "Thickness", kind: "number", default: 1, min: 1, max: 8, step: 1, unit: "px" },
    ],
    tree: (p) => {
      const vertical = p.s("orientation") === "vertical";
      const length = Math.round(p.n("length"));
      const thickness = Math.round(p.n("thickness"));
      return h("Separator", {
        orientation: vertical ? "vertical" : undefined,
        style: { ...(vertical ? { height: length } : { width: length }), ...(thickness === 1 ? {} : vertical ? { width: thickness } : { height: thickness }) },
      });
    },
  },
  {
    slug: "scroll-area",
    name: "Scroll area",
    category: "Containment",
    icon: "swap_vert",
    w: 256,
    h: 192,
    props: [
      { key: "scrollbars", label: "Scrollbars", kind: "enum", default: "vertical", options: ["vertical", "horizontal", "both"] },
      { key: "label", label: "Row label", kind: "text", default: "Item" },
      { key: "count", label: "Rows", kind: "number", default: 30, min: 1, max: 100, step: 1 },
      { key: "width", label: "Width", kind: "number", default: 256, min: 120, max: 560, step: 4, unit: "px" },
      { key: "height", label: "Height", kind: "number", default: 192, min: 80, max: 480, step: 4, unit: "px" },
    ],
    tree: (p) => {
      const scrollbars = p.s("scrollbars");
      const rows = Array.from({ length: Math.round(p.n("count")) }, (_, i) => h("span", null, `${p.s("label")} ${i + 1}`));
      // literal class names: Tailwind only sees what is written out
      const inner = { vertical: "flex flex-col gap-2 p-4 text-body-medium text-on-surface", horizontal: "flex w-max gap-4 p-4 text-body-medium text-on-surface", both: "flex w-max flex-col gap-2 p-4 text-body-medium text-on-surface" }[scrollbars];
      return h(
        "ScrollArea",
        { scrollbars: scrollbars === "vertical" ? undefined : scrollbars, className: "rounded-md border border-outline-variant", style: { width: Math.round(p.n("width")), height: Math.round(p.n("height")) } },
        h("div", { className: inner }, ...rows),
      );
    },
  },
  {
    slug: "resizable",
    name: "Resizable",
    category: "Containment",
    icon: "vertical_split",
    w: 400,
    h: 160,
    props: [
      { key: "orientation", label: "Orientation", kind: "enum", default: "horizontal", options: ["horizontal", "vertical"] },
      { key: "first", label: "First panel", kind: "text", default: "Left" },
      { key: "second", label: "Second panel", kind: "text", default: "Right" },
      { key: "split", label: "First panel size", kind: "number", default: 40, min: 10, max: 90, step: 5, unit: "%" },
      { key: "handle", label: "Grip on the handle", kind: "bool", default: true },
      { key: "width", label: "Width", kind: "number", default: 400, min: 160, max: 640, step: 4, unit: "px" },
      { key: "height", label: "Height", kind: "number", default: 160, min: 80, max: 400, step: 4, unit: "px" },
    ],
    tree: (p) => {
      const split = Math.round(p.n("split"));
      const panel = (text: string, size: number) =>
        h("ResizablePanel", { defaultSize: size }, h("div", { className: "flex h-full items-center justify-center text-on-surface" }, text));
      return h(
        "ResizablePanelGroup",
        {
          orientation: p.s("orientation"),
          className: "rounded-lg border border-outline-variant",
          style: { width: Math.round(p.n("width")), height: Math.round(p.n("height")) },
        },
        panel(p.s("first"), split),
        h("ResizableHandle", { withHandle: p.b("handle") || undefined }),
        panel(p.s("second"), 100 - split),
      );
    },
  },
];
