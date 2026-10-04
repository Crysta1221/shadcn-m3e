import { h, ic } from "../node";
import type { PartDef } from "../types";

export const textInputs: PartDef[] = [
  {
    slug: "text-field",
    name: "Text field",
    category: "Text inputs",
    icon: "text_fields",
    w: 280,
    h: 56,
    props: [
      { key: "label", label: "Label", kind: "text", default: "Label" },
      { key: "supporting", label: "Supporting text", kind: "text", default: "" },
      { key: "variant", label: "Variant", kind: "enum", default: "outlined", options: ["outlined", "filled"] },
      { key: "leadingIcon", label: "Leading icon", kind: "icon", default: "" },
      { key: "trailingIcon", label: "Trailing icon", kind: "icon", default: "" },
      { key: "error", label: "Error", kind: "bool", default: false },
      { key: "multiline", label: "Multiline", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 280, min: 120, max: 520, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h(
        "div",
        { style: { width: Math.round(p.n("width")) } },
        h("TextField", {
          label: p.s("label"),
          variant: p.s("variant") === "filled" ? "filled" : undefined,
          supportingText: p.s("supporting") || undefined,
          leadingIcon: p.s("leadingIcon") ? ic(p.s("leadingIcon")) : undefined,
          trailingIcon: p.s("trailingIcon") ? ic(p.s("trailingIcon")) : undefined,
          error: p.b("error") || undefined,
          multiline: p.b("multiline") || undefined,
          containerClassName: "w-full",
        }),
      ),
  },
  {
    slug: "input",
    name: "Input",
    category: "Text inputs",
    icon: "edit_note",
    w: 280,
    h: 56,
    props: [
      { key: "placeholder", label: "Placeholder", kind: "text", default: "Email" },
      { key: "value", label: "Value", kind: "text", default: "" },
      { key: "type", label: "Type", kind: "enum", default: "text", options: ["text", "email", "password", "number", "search", "tel", "url"] },
      { key: "variant", label: "Variant", kind: "enum", default: "outlined", options: ["outlined", "filled"] },
      { key: "size", label: "Size", kind: "enum", default: "default", options: ["default", "sm"] },
      { key: "error", label: "Error", kind: "bool", default: false },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 280, min: 120, max: 520, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h("Input", {
        type: p.s("type") === "text" ? undefined : p.s("type"),
        placeholder: p.s("placeholder") || undefined,
        defaultValue: p.s("value") || undefined,
        variant: p.s("variant") === "filled" ? "filled" : undefined,
        size: p.s("size") === "sm" ? "sm" : undefined,
        "aria-invalid": p.b("error") || undefined,
        disabled: p.b("disabled") || undefined,
        style: { width: Math.round(p.n("width")) },
      }),
  },
  {
    slug: "textarea",
    name: "Textarea",
    category: "Text inputs",
    icon: "notes",
    w: 280,
    h: 96,
    props: [
      { key: "placeholder", label: "Placeholder", kind: "text", default: "Type your message here." },
      { key: "value", label: "Value", kind: "text", default: "", multiline: true },
      { key: "variant", label: "Variant", kind: "enum", default: "outlined", options: ["outlined", "filled"] },
      { key: "rows", label: "Rows", kind: "number", default: 3, min: 2, max: 10, step: 1 },
      { key: "error", label: "Error", kind: "bool", default: false },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 280, min: 120, max: 520, step: 4, unit: "px" },
    ],
    tree: (p) =>
      h("Textarea", {
        placeholder: p.s("placeholder") || undefined,
        defaultValue: p.s("value") || undefined,
        variant: p.s("variant") === "filled" ? "filled" : undefined,
        rows: p.n("rows"),
        "aria-invalid": p.b("error") || undefined,
        disabled: p.b("disabled") || undefined,
        style: { width: Math.round(p.n("width")) },
      }),
  },
  {
    slug: "input-group",
    name: "Input group",
    category: "Text inputs",
    icon: "input",
    w: 320,
    h: 56,
    props: [
      { key: "placeholder", label: "Placeholder", kind: "text", default: "Search..." },
      { key: "leadingIcon", label: "Leading icon", kind: "icon", default: "search" },
      { key: "leadingText", label: "Leading text", kind: "text", default: "" },
      { key: "trailingText", label: "Trailing text", kind: "text", default: "" },
      { key: "button", label: "Trailing button", kind: "text", default: "" },
      { key: "error", label: "Error", kind: "bool", default: false },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 320, min: 160, max: 520, step: 4, unit: "px" },
    ],
    tree: (p) => {
      const leadingIcon = p.s("leadingIcon");
      const leadingText = p.s("leadingText");
      const trailingText = p.s("trailingText");
      const button = p.s("button");
      return h(
        "InputGroup",
        { style: { width: Math.round(p.n("width")) } },
        !!(leadingIcon || leadingText) && h("InputGroupAddon", null, !!leadingIcon && ic(leadingIcon, { size: 20 }), !!leadingText && h("InputGroupText", null, leadingText)),
        h("InputGroupInput", { placeholder: p.s("placeholder") || undefined, "aria-invalid": p.b("error") || undefined, disabled: p.b("disabled") || undefined }),
        !!(trailingText || button) &&
          h("InputGroupAddon", { align: "inline-end" }, !!trailingText && h("InputGroupText", null, trailingText), !!button && h("InputGroupButton", { variant: "tonal", disabled: p.b("disabled") || undefined }, button)),
      );
    },
  },
  {
    slug: "input-otp",
    name: "Input OTP",
    category: "Text inputs",
    icon: "pin",
    w: 340,
    h: 56,
    props: [
      { key: "length", label: "Length", kind: "number", default: 6, min: 2, max: 8, step: 1 },
      { key: "group", label: "Group size (0: one group)", kind: "number", default: 3, min: 0, max: 8, step: 1 },
      { key: "value", label: "Value", kind: "text", default: "" },
      { key: "error", label: "Error", kind: "bool", default: false },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
    ],
    tree: (p) => {
      const length = Math.round(p.n("length"));
      const size = Math.round(p.n("group")) || length;
      const slot = (index: number) => h("InputOTPSlot", { index, "aria-invalid": p.b("error") || undefined });
      const parts: ReturnType<typeof h>[] = [];
      for (let from = 0; from < length; from += size) {
        if (from > 0) parts.push(h("InputOTPSeparator"));
        parts.push(h("InputOTPGroup", null, ...Array.from({ length: Math.min(size, length - from) }, (_, i) => slot(from + i))));
      }
      return h("InputOTP", { maxLength: length, defaultValue: p.s("value").slice(0, length) || undefined, disabled: p.b("disabled") || undefined }, ...parts);
    },
  },
  {
    slug: "field",
    name: "Field",
    category: "Text inputs",
    icon: "list_alt",
    w: 320,
    h: 96,
    props: [
      { key: "label", label: "Label", kind: "text", default: "Email" },
      { key: "control", label: "Control", kind: "enum", default: "input", options: ["input", "textarea", "checkbox", "switch"] },
      { key: "placeholder", label: "Placeholder", kind: "text", default: "you@example.com" },
      { key: "description", label: "Description", kind: "text", default: "We will never share it." },
      { key: "error", label: "Error message", kind: "text", default: "" },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
      { key: "width", label: "Width", kind: "number", default: 320, min: 160, max: 520, step: 4, unit: "px" },
    ],
    tree: (p) => {
      const control = p.s("control");
      const error = p.s("error");
      const invalid = !!error || undefined;
      const disabled = p.b("disabled") || undefined;
      const field = { id: "field-control", "aria-invalid": invalid, disabled };
      const horizontal = control === "checkbox" || control === "switch";
      const label = h("FieldLabel", { htmlFor: "field-control" }, p.s("label"));
      const input =
        control === "checkbox"
          ? h("Checkbox", field)
          : control === "switch"
            ? h("Switch", { id: "field-control", disabled })
            : control === "textarea"
              ? h("Textarea", { ...field, placeholder: p.s("placeholder") || undefined })
              : h("Input", { ...field, placeholder: p.s("placeholder") || undefined });
      const description = !!p.s("description") && h("FieldDescription", null, p.s("description"));
      const message = !!error && h("FieldError", null, error);
      return h(
        "Field",
        { orientation: horizontal ? "horizontal" : undefined, "data-invalid": invalid, "data-disabled": disabled, style: { width: Math.round(p.n("width")) } },
        ...(horizontal ? [input, h("FieldContent", null, label, description, message)] : [label, input, description, message]),
      );
    },
  },
  {
    slug: "label",
    name: "Label",
    category: "Text inputs",
    icon: "sell",
    w: 120,
    h: 24,
    props: [
      { key: "text", label: "Text", kind: "text", default: "Accept terms and conditions" },
      { key: "control", label: "Control", kind: "enum", default: "checkbox", options: ["checkbox", "switch", "none"] },
      { key: "disabled", label: "Disabled", kind: "bool", default: false },
    ],
    tree: (p) => {
      const control = p.s("control");
      const disabled = p.b("disabled") || undefined;
      return h(
        "Label",
        { htmlFor: control === "none" ? undefined : "label-control" },
        control === "checkbox" && h("Checkbox", { id: "label-control", disabled }),
        control === "switch" && h("Switch", { id: "label-control", disabled }),
        p.s("text"),
      );
    },
  },
];
