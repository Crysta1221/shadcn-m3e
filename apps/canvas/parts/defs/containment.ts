import { h, ic, type PNode } from "../node";
import { around, type P, type PartDef } from "../types";

const BUTTON_VARIANTS = ["filled", "tonal", "elevated", "outlined", "text"];

/* literal class names: Tailwind only sees what is written out */
const ALIGN_ITEMS = { start: undefined, center: "items-center", end: "items-end" } as const;
const ALIGN_TEXT = { start: undefined, center: "text-center", end: "text-end" } as const;
const JUSTIFY = { start: undefined, center: "justify-center", end: "justify-end" } as const;
const SCRIM = {
  start: "bg-gradient-to-b from-black/60 via-black/15 to-transparent",
  center: "bg-black/40",
  end: "bg-gradient-to-t from-black/60 via-black/15 to-transparent",
} as const;

/** the card's image area: a band along the top or bottom, a column down a side, or the whole
 *  background behind a scrim. The placeholder is an icon on primary-container. */
function cardTree(p: P): PNode {
  const pos = p.s("imagePos");
  const src = p.s("image");
  const bg = pos === "background";
  const side = pos === "leading" || pos === "trailing";
  const extent = Math.round(p.n("imageSize"));
  const inner = src
    ? h("img", { src, alt: "", className: "size-full object-cover" })
    : h("div", { className: "grid size-full place-items-center bg-primary-container text-on-primary-container" }, ic(p.s("imageIcon") || "image", { size: 34 }));
  const media =
    pos === "none"
      ? null
      : bg
        ? h("div", { className: "absolute inset-0" }, inner)
        : side
          ? h("div", { className: "shrink-0 self-stretch overflow-hidden -my-(--card-spacing)", style: { width: extent } }, inner)
          : h("div", { className: "w-full shrink-0 overflow-hidden", style: { height: extent } }, inner);
  /* over a photo the words need a scrim; over the placeholder they take the container's on-color */
  const ink = bg ? (src ? "text-white" : "text-on-primary-container") : undefined;
  const body = bg ? (src ? "text-white/80" : "text-on-primary-container/80") : undefined;
  const first = pos === "top" || pos === "leading" || bg;
  const textCls = ALIGN_TEXT[p.s("textAlign") as keyof typeof ALIGN_TEXT];
  const style: Record<string, number> = { width: Math.round(p.n("width")) };
  if (p.n("height") > 0) style.height = Math.round(p.n("height"));
  if (pos === "top") style.paddingTop = 0;
  if (pos === "bottom") style.paddingBottom = 0;
  const header = h(
    "CardHeader",
    { className: bg ? "relative" : undefined },
    h("CardTitle", { className: [ink, textCls].filter(Boolean).join(" ") || undefined }, p.s("title")),
    p.s("description") && h("CardDescription", { className: [body, textCls].filter(Boolean).join(" ") || undefined }, p.s("description")),
  );
  const footer = p.s("action") && h("CardFooter", { className: bg ? "relative" : undefined }, h("Button", { variant: "text", size: "sm" }, p.s("action")));
  return h(
    "Card",
    {
      variant: p.s("variant"),
      size: p.s("size") === "default" ? undefined : p.s("size"),
      interactive: p.b("interactive") || undefined,
      className:
        [
          side && "flex-row",
          ALIGN_ITEMS[p.s("textAlign") as keyof typeof ALIGN_ITEMS],
          JUSTIFY[p.s("contentAlign") as keyof typeof JUSTIFY],
        ]
          .filter(Boolean)
          .join(" ") || undefined,
      style,
    },
    media && first && media,
    media && first && bg && src && h("div", { className: `absolute inset-0 ${SCRIM[p.s("contentAlign") as keyof typeof SCRIM]}` }),
    header,
    footer,
    media && !first && media,
  );
}

export const containment: PartDef[] = [
  {
    slug: "card",
    name: "Card",
    category: "Containment",
    icon: "credit_card",
    role: "listLike",
    appearance: { radius: 12 },
    w: 280,
    h: 120,
    props: [
      { key: "title", label: "Title", kind: "text", default: "Card title" },
      { key: "description", label: "Description", kind: "text", default: "Supporting text for the card.", multiline: true },
      { key: "variant", label: "Variant", kind: "enum", default: "filled", options: ["filled", "elevated", "outlined"] },
      {
        key: "imagePos",
        label: "Image position",
        kind: "enum",
        default: "top",
        options: [
          { value: "none", label: "None" },
          { value: "top", label: "Top" },
          { value: "bottom", label: "Bottom" },
          { value: "leading", label: "Left" },
          { value: "trailing", label: "Right" },
          { value: "background", label: "Background" },
        ],
      },
      { key: "image", label: "Image", kind: "image", when: (p) => p.s("imagePos") !== "none" },
      { key: "imageIcon", label: "Placeholder icon", kind: "icon", default: "image", when: (p) => p.s("imagePos") !== "none" && !p.s("image") },
      { key: "imageSize", label: "Image size", kind: "number", default: 96, min: 40, max: 320, step: 4, unit: "px", when: (p) => ["top", "bottom", "leading", "trailing"].includes(p.s("imagePos")) },
      { key: "textAlign", label: "Text align", kind: "enum", default: "start", options: ["start", "center", "end"] },
      { key: "contentAlign", label: "Content align", kind: "enum", default: "start", options: ["start", "center", "end"] },
      { key: "size", label: "Density", kind: "enum", default: "default", options: ["sm", "default", "lg"] },
      { key: "interactive", label: "Interactive", kind: "bool", default: false },
      { key: "action", label: "Action button", kind: "text", default: "" },
      { key: "width", label: "Width", kind: "number", default: 280, min: 160, max: 520, step: 4, unit: "px" },
      { key: "height", label: "Height (0: auto)", kind: "number", default: 0, min: 0, max: 480, step: 4, unit: "px" },
    ],
    tree: (p) => cardTree(p),
  },
  {
    slug: "item",
    name: "List item",
    category: "Containment",
    icon: "list_alt",
    role: "listLike",
    /* the paint goes on each row, not the group they share */
    appearance: { target: "Item", radius: 16 },
    w: 280,
    h: 64,
    props: [
      { key: "items", label: "Rows", kind: "list", default: [{ label: "Inbox", icon: "inbox" }], min: 1, max: 6, icons: true },
      { key: "description", label: "Supporting text", kind: "text", default: "12 new messages" },
      { key: "variant", label: "Variant", kind: "enum", default: "default", options: ["default", "outline", "muted", "segmented"] },
      { key: "size", label: "Size", kind: "enum", default: "default", options: ["default", "sm", "xs"] },
      { key: "trailing", label: "Trailing", kind: "enum", default: "none", options: ["none", "icon", "switch"] },
      { key: "trailingIcon", label: "Trailing icon", kind: "icon", default: "chevron_right", when: (p) => p.s("trailing") === "icon" },
      { key: "checked", label: "Switch on", kind: "bool", default: false, when: (p) => p.s("trailing") === "switch" },
      { key: "width", label: "Width", kind: "number", default: 280, min: 160, max: 520, step: 4, unit: "px" },
    ],
    slots: (p) => p.list("items").map((it, i) => ({ key: `tab:${i}`, label: it.label || `${i + 1}`, icon: it.icon })),
    tree: (p) => {
      const trailing = p.s("trailing");
      const end =
        trailing === "switch"
          ? h("ItemActions", null, h("Switch", { defaultChecked: p.b("checked") || undefined }))
          : trailing === "icon" && p.s("trailingIcon")
            ? h("ItemActions", null, h("Button", { variant: "text", size: "icon", "aria-label": "Open" }, ic(p.s("trailingIcon"))))
            : null;
      const row = (it: { label: string; icon?: string }, i: number) =>
        h(
          "Item",
          { variant: p.s("variant") === "default" ? undefined : p.s("variant"), size: p.s("size") === "default" ? undefined : p.s("size"), "data-tap": `tab:${i}` },
          it.icon && h("ItemMedia", { variant: "icon" }, ic(it.icon)),
          h("ItemContent", null, h("ItemTitle", null, it.label), p.s("description") && h("ItemDescription", null, p.s("description"))),
          end,
        );
      const rows = p.list("items").map(row);
      return h("div", { style: { width: Math.round(p.n("width")) } }, rows.length === 1 ? rows[0] : h("ItemGroup", null, ...rows));
    },
  },
  {
    slug: "dialog",
    name: "Dialog",
    category: "Containment",
    icon: "web_asset",
    role: "overlay",
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
      /* the basic style sizes its card too, under its own key — the `axis` mark still
       *  makes it the prop the width handle pulls */
      { key: "dialogWidth", label: "Width", kind: "number", default: 412, min: 280, max: 560, step: 4, unit: "px", axis: "width", when: (p) => p.s("style") === "basic" },
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
          { showCloseButton: p.b("closeButton") ? undefined : false, style: p.n("dialogWidth") === 412 ? undefined : { width: Math.min(560, Math.round(p.n("dialogWidth"))) } },
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
    role: "overlay",
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
    role: "overlay",
    w: 300,
    h: 480,
    props: [
      { key: "side", label: "Side", kind: "enum", default: "right", options: ["right", "left", "bottom", "top"] },
      { key: "title", label: "Title", kind: "text", default: "Filters" },
      { key: "description", label: "Description", kind: "text", default: "Narrow down the results.", multiline: true },
      { key: "footer", label: "Save and Cancel", kind: "bool", default: false },
    ],
    /* the look belongs to the panel inside the portal, not the root that opens it */
    appearance: { target: "SheetContent", radius: 16 },
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
    appearance: { target: "SideSheet", radius: 16 },
    /* the box stands in for the app window the sheet docks to; on a screen it never outgrows
     * the real one (the layout margins are 16dp on each side) */
    view: (p, s) => sideSheetTree(p, Math.min(Math.round(p.n("width")) + 280, s ? Math.max(200, s.w - 32) : Number.POSITIVE_INFINITY)),
    tree: (p) => sideSheetTree(p, Math.round(p.n("width")) + 280),
  },
  {
    slug: "drawer",
    name: "Drawer",
    category: "Containment",
    icon: "vertical_align_bottom",
    role: "bottom",
    w: 412,
    h: 200,
    props: [
      { key: "title", label: "Title", kind: "text", default: "Share" },
      { key: "description", label: "Description", kind: "text", default: "Choose where to send this.", multiline: true },
      { key: "close", label: "Close action", kind: "text", default: "Close" },
      { key: "swipeHandle", label: "Swipe handle", kind: "bool", default: true },
      { key: "inline", label: "Inline (standard sheet)", kind: "bool", default: false },
    ],
    appearance: { target: "DrawerContent", radius: 28 },
    open: { box: () => ({ w: 412, h: 560 }), trigger: "hide", fit: true },
    tree: (p) =>
      h(
        "Drawer",
        { showSwipeHandle: p.b("swipeHandle") || undefined, modal: p.b("inline") ? false : undefined },
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
    open: { box: (p) => around(p.s("side"), 288, 150, 90, 24) },
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
    role: "listLike",
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

/** the side sheet's demo: the sheet docked in a stand-in app window `w` wide */
const sideSheetTree = (p: P, w: number) => {
  const width = Math.round(p.n("width"));
  return h(
    "div",
    { className: "flex overflow-hidden rounded-lg border border-outline-variant", style: { width: w, height: Math.round(p.n("height")) } },
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
};
