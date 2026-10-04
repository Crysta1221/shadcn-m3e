import { h, ic } from "../node";
import type { PartDef } from "../types";

const BUBBLE_VARIANTS = ["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"];

const px = (n: number) => Math.round(n);

/** a variant the component already defaults to is left out of the code */
const variantOf = (v: string) => (v === "default" ? undefined : v);

export const chat: PartDef[] = [
  {
    slug: "message",
    name: "Message",
    category: "Chat",
    icon: "forum",
    w: 320,
    h: 56,
    props: [
      { key: "text", label: "Text", kind: "text", default: "How can I help?", multiline: true },
      { key: "align", label: "Side", kind: "enum", default: "start", options: [{ value: "start", label: "Received" }, { value: "end", label: "Sent" }] },
      { key: "variant", label: "Bubble", kind: "enum", default: "muted", options: BUBBLE_VARIANTS },
      { key: "avatar", label: "Avatar initials", kind: "text", default: "AI" },
      { key: "header", label: "Sender", kind: "text", default: "" },
      { key: "footer", label: "Footer", kind: "text", default: "" },
      { key: "width", label: "Width", kind: "number", default: 320, min: 200, max: 640, step: 4, unit: "px" },
    ],
    tree: (p) => {
      const align = p.s("align");
      return h(
        "MessageGroup",
        { style: { width: px(p.n("width")) } },
        h(
          "Message",
          { align: align === "end" ? "end" : undefined },
          p.s("avatar") && h("MessageAvatar", null, h("Avatar", { size: "sm" }, h("AvatarFallback", null, p.s("avatar")))),
          h(
            "MessageContent",
            null,
            p.s("header") && h("MessageHeader", null, p.s("header")),
            h("Bubble", { variant: variantOf(p.s("variant")), align: align === "end" ? "end" : undefined }, h("BubbleContent", null, p.s("text"))),
            p.s("footer") && h("MessageFooter", null, p.s("footer")),
          ),
        ),
      );
    },
  },
  {
    slug: "bubble",
    name: "Bubble",
    category: "Chat",
    icon: "chat_bubble",
    w: 240,
    h: 44,
    props: [
      { key: "text", label: "Text", kind: "text", default: "Sounds good, see you then.", multiline: true },
      { key: "variant", label: "Variant", kind: "enum", default: "default", options: BUBBLE_VARIANTS },
      { key: "align", label: "Side", kind: "enum", default: "start", options: [{ value: "start", label: "Received" }, { value: "end", label: "Sent" }] },
      { key: "reaction", label: "Reaction", kind: "text", default: "" },
      { key: "width", label: "Width", kind: "number", default: 280, min: 160, max: 640, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h(
        "BubbleGroup",
        { style: { width: px(p.n("width")) } },
        h(
          "Bubble",
          { variant: variantOf(p.s("variant")), align: p.s("align") === "end" ? "end" : undefined },
          h("BubbleContent", null, p.s("text")),
          p.s("reaction") && h("BubbleReactions", null, p.s("reaction")),
        ),
      ),
  },
  {
    slug: "marker",
    name: "Marker",
    category: "Chat",
    icon: "bookmark",
    w: 320,
    h: 20,
    props: [
      { key: "text", label: "Text", kind: "text", default: "Today" },
      { key: "variant", label: "Variant", kind: "enum", default: "separator", options: ["default", "separator", "border"] },
      { key: "icon", label: "Icon", kind: "icon", default: "" },
      { key: "width", label: "Width", kind: "number", default: 320, min: 120, max: 640, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h(
        "Marker",
        { variant: p.s("variant"), style: { width: px(p.n("width")) } },
        p.s("icon") && h("MarkerIcon", null, ic(p.s("icon"))),
        h("MarkerContent", null, p.s("text")),
      ),
  },
  {
    slug: "attachment",
    name: "Attachment",
    category: "Chat",
    icon: "attach_file",
    w: 200,
    h: 60,
    props: [
      { key: "title", label: "Title", kind: "text", default: "report.pdf" },
      { key: "description", label: "Description", kind: "text", default: "2.4 MB" },
      { key: "icon", label: "Icon", kind: "icon", default: "description" },
      { key: "state", label: "State", kind: "enum", default: "done", options: ["done", "idle", "uploading", "processing", "error"] },
      { key: "size", label: "Size", kind: "enum", default: "default", options: ["default", "sm", "xs"] },
      { key: "orientation", label: "Orientation", kind: "enum", default: "horizontal", options: ["horizontal", "vertical"] },
      { key: "remove", label: "Remove button", kind: "bool", default: false },
    ],
    tree: (p) =>
      h(
        "Attachment",
        {
          state: p.s("state") === "done" ? undefined : p.s("state"),
          size: p.s("size") === "default" ? undefined : p.s("size"),
          orientation: p.s("orientation") === "horizontal" ? undefined : p.s("orientation"),
        },
        h("AttachmentMedia", null, ic(p.s("icon") || "description")),
        h("AttachmentContent", null, h("AttachmentTitle", null, p.s("title")), p.s("description") && h("AttachmentDescription", null, p.s("description"))),
        p.b("remove") && h("AttachmentActions", null, h("AttachmentAction", { "aria-label": "Remove" }, ic("close"))),
      ),
  },
  {
    slug: "message-scroller",
    name: "Message scroller",
    category: "Chat",
    icon: "vertical_align_bottom",
    w: 360,
    h: 288,
    props: [
      {
        key: "messages",
        label: "Messages (they alternate between received and sent)",
        kind: "list",
        default: [{ label: "Hi! Ask me anything." }, { label: "What is a spatial spring?" }, { label: "One that moves things, and may overshoot a little." }, { label: "Thanks!" }],
        min: 2,
        max: 8,
      },
      { key: "button", label: "Jump to newest button", kind: "bool", default: true },
      { key: "width", label: "Width", kind: "number", default: 360, min: 240, max: 640, step: 4, unit: "px" },
      { key: "height", label: "Height", kind: "number", default: 288, min: 160, max: 480, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h(
        "MessageScrollerProvider",
        { defaultScrollPosition: "end" },
        h(
          "div",
          { className: "overflow-hidden rounded-lg border border-outline-variant bg-surface", style: { width: px(p.n("width")), height: px(p.n("height")) } },
          h(
            "MessageScroller",
            null,
            h(
              "MessageScrollerViewport",
              null,
              h(
                "MessageScrollerContent",
                { className: "gap-3 p-4" },
                ...p.list("messages").map((m, i) => {
                  const mine = i % 2 === 1;
                  return h(
                    "MessageScrollerItem",
                    { messageId: String(i + 1) },
                    h(
                      "Message",
                      { align: mine ? "end" : undefined },
                      !mine && h("MessageAvatar", null, h("Avatar", { size: "sm" }, h("AvatarFallback", null, "AI"))),
                      h(
                        "MessageContent",
                        null,
                        h("Bubble", { align: mine ? "end" : undefined, variant: mine ? undefined : "muted" }, h("BubbleContent", null, m.label)),
                      ),
                    ),
                  );
                }),
              ),
            ),
            p.b("button") && h("MessageScrollerButton"),
          ),
        ),
      ),
  },
  {
    slug: "questionnaire",
    name: "Questionnaire",
    category: "Chat",
    icon: "quiz",
    w: 400,
    h: 360,
    props: [
      { key: "question", label: "Question", kind: "text", default: "Which framework do you use?" },
      { key: "description", label: "Hint", kind: "text", default: "Pick one." },
      { key: "choices", label: "Choices", kind: "list", default: [{ label: "React" }, { label: "Svelte" }, { label: "Vue" }], min: 2, max: 5 },
      { key: "multiple", label: "Several answers", kind: "bool", default: false },
      { key: "steps", label: "Questions", kind: "number", default: 2, min: 1, max: 3, step: 1 },
      { key: "width", label: "Width", kind: "number", default: 400, min: 240, max: 640, step: 4, unit: "px" },
    ],
    tree: (p) => {
      const steps = px(p.n("steps"));
      return h(
        "Questionnaire",
        { style: { width: px(p.n("width")) } },
        h("QuestionnaireProgress"),
        h(
          "QuestionnaireItem",
          { name: "choice", required: true, multiple: p.b("multiple") || undefined },
          h("QuestionnaireTitle", null, p.s("question")),
          p.s("description") && h("QuestionnaireDescription", null, p.s("description")),
          h("QuestionnaireChoices", null, ...p.list("choices").map((c) => h("QuestionnaireChoice", { value: c.label.toLowerCase().replace(/\s+/g, "-") }, c.label))),
          h("QuestionnaireError", null, "Choose one to continue."),
        ),
        steps > 1 && h("QuestionnaireItem", { name: "note" }, h("QuestionnaireTitle", null, "Anything else?"), h("QuestionnaireInput", { placeholder: "Optional" })),
        steps > 2 && h("QuestionnaireItem", { name: "feedback" }, h("QuestionnaireTitle", null, "How can we improve?"), h("QuestionnaireInput", { placeholder: "Optional" })),
        h("QuestionnaireActions", null, h("QuestionnairePrevious"), h("QuestionnaireSkip"), h("QuestionnaireNext"), h("QuestionnaireSubmit")),
      );
    },
  },
];
