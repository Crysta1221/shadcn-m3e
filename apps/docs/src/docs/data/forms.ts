import type { DocEntry } from "../registry"

/** Selection controls and text inputs */
export const forms: DocEntry[] = [
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "Selection",
    icon: "check_box",
    origin: "shadcn",
    description:
      "Select one or more items from a list. An 18dp box on a 40dp circular state layer; the check draws itself in.",
    spec: "https://m3.material.io/components/checkbox/overview",
    imports: [{ from: "checkbox", names: ["Checkbox"] }],
    notes: [
      "Pair it with a Label. Use aria-invalid to show the error color and indeterminate for a partly-selected parent.",
    ],
  },
  {
    slug: "radio-group",
    name: "Radio group",
    category: "Selection",
    icon: "radio_button_checked",
    origin: "shadcn",
    description:
      "Choose exactly one option from a set. The dot springs in when selected.",
    spec: "https://m3.material.io/components/radio-button/overview",
    imports: [{ from: "radio-group", names: ["RadioGroup", "RadioGroupItem"] }],
  },
  {
    slug: "switch",
    name: "Switch",
    category: "Selection",
    icon: "toggle_on",
    origin: "shadcn",
    description:
      "Turns a single setting on or off. The handle grows when selected and squeezes to 28dp while pressed.",
    spec: "https://m3.material.io/components/switch/overview",
    imports: [
      {
        from: "switch",
        names: ["Switch", "CheckedIcon", "UncheckedIcon"],
      },
    ],
    notes: [
      "Nest CheckedIcon and/or UncheckedIcon inside Switch for handle glyphs. UncheckedIcon keeps the handle at 24dp in both states so the icon fits.",
    ],
    props: [
      {
        rows: [
          {
            name: "size",
            type: '"default" | "sm"',
            default: '"default"',
            description: "52×32dp, or a compact 40×24dp (not in the M3 spec).",
          },
        ],
      },
    ],
  },
  {
    slug: "slider",
    name: "Slider",
    category: "Selection",
    icon: "tune",
    origin: "shadcn",
    description:
      "Pick a value or a range. The M3E slider has a 16dp track split around a bar handle, with a stop indicator at the end.",
    spec: "https://m3.material.io/components/sliders/overview",
    imports: [{ from: "slider", names: ["Slider"] }],
    notes: [
      'Pass two values for a range slider. Vertical sliders use orientation="vertical".',
    ],
  },
  {
    slug: "select",
    name: "Select",
    category: "Selection",
    icon: "arrow_drop_down_circle",
    origin: "shadcn",
    description:
      "A field that opens a menu of options, outlined or filled, with an optional floating label and supporting text. The chosen option is highlighted in tertiary-container.",
    spec: "https://m3.material.io/components/menus/overview",
    imports: [
      {
        from: "select",
        names: [
          "Select",
          "SelectTrigger",
          "SelectValue",
          "SelectContent",
          "SelectItem",
        ],
      },
    ],
    notes: [
      "Give Select an items array so SelectValue can show the label of the chosen value.",
    ],
    props: [
      {
        title: "SelectTrigger",
        rows: [
          {
            name: "variant",
            type: '"outlined" | "filled"',
            default: '"outlined"',
            description:
              "Outlined is a 1dp outline; filled is surface-container-highest with a bottom active indicator.",
          },
          {
            name: "label",
            type: "ReactNode",
            description:
              "Floats above the field — in the border notch (outlined) or at the top inside (filled).",
          },
          {
            name: "supporting",
            type: "ReactNode",
            description: "Helper text under the field.",
          },
          {
            name: "size",
            type: '"default" | "sm"',
            default: '"default"',
            description: "56dp or 40dp.",
          },
        ],
      },
    ],
  },
  {
    slug: "native-select",
    name: "Native select",
    category: "Selection",
    icon: "list",
    origin: "shadcn",
    description:
      "The browser's own <select>, styled as an M3 outlined field. Best on touch devices.",
    imports: [
      {
        from: "native-select",
        names: ["NativeSelect", "NativeSelectOption", "NativeSelectOptGroup"],
      },
    ],
  },
  {
    slug: "combobox",
    name: "Combobox",
    category: "Selection",
    icon: "manage_search",
    origin: "shadcn",
    description:
      "An input with a filterable list of options; supports multiple selection with chips.",
    imports: [
      {
        from: "combobox",
        names: [
          "Combobox",
          "ComboboxInput",
          "ComboboxContent",
          "ComboboxList",
          "ComboboxItem",
          "ComboboxEmpty",
        ],
      },
    ],
  },
  {
    slug: "text-field",
    name: "Text field",
    category: "Text inputs",
    icon: "text_fields",
    origin: "m3e",
    description:
      "An outlined or filled field with a floating label, icons, prefix and suffix, and supporting text.",
    spec: "https://m3.material.io/components/text-fields/overview",
    imports: [{ from: "text-field", names: ["TextField"] }],
    notes: [
      "The label floats while the field is focused or holds a value. Text fields are 56dp tall with extra-small corners.",
    ],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: '"outlined" | "filled"',
            default: '"outlined"',
            description:
              "Outlined draws a notch for the label; filled uses a container and an indicator.",
          },
          { name: "label", type: "ReactNode", description: "Floating label." },
          {
            name: "supportingText",
            type: "ReactNode",
            description: "Helper text below the field.",
          },
          {
            name: "error / errorText",
            type: "boolean / ReactNode",
            description:
              "Error state and message (replaces the supporting text).",
          },
          {
            name: "leadingIcon / trailingIcon",
            type: "ReactNode",
            description: "24dp icons inside the field.",
          },
          {
            name: "prefix / suffix",
            type: "ReactNode",
            description: "Text shown while the field is focused or filled.",
          },
          {
            name: "multiline / rows",
            type: "boolean / number",
            default: "false / 3",
            description: "Render a textarea.",
          },
        ],
      },
    ],
  },
  {
    slug: "input",
    name: "Input",
    category: "Text inputs",
    icon: "edit_note",
    origin: "shadcn",
    description:
      "A bare text input in the M3 outlined or filled container styles. Use Text field when you want a floating label.",
    imports: [{ from: "input", names: ["Input"] }],
    props: [
      {
        rows: [
          {
            name: "variant",
            type: '"outlined" | "filled"',
            default: '"outlined"',
            description: "Container style.",
          },
          {
            name: "size",
            type: '"default" | "sm"',
            default: '"default"',
            description: "56dp or 40dp tall.",
          },
        ],
      },
    ],
  },
  {
    slug: "textarea",
    name: "Textarea",
    category: "Text inputs",
    icon: "notes",
    origin: "shadcn",
    description: "A multi-line input that grows with its content.",
    imports: [{ from: "textarea", names: ["Textarea"] }],
  },
  {
    slug: "input-group",
    name: "Input group",
    category: "Text inputs",
    icon: "input",
    origin: "shadcn",
    description:
      "An input with icons, text, buttons or shortcuts attached at either end.",
    imports: [
      {
        from: "input-group",
        names: [
          "InputGroup",
          "InputGroupAddon",
          "InputGroupInput",
          "InputGroupButton",
          "InputGroupText",
        ],
      },
    ],
  },
  {
    slug: "input-otp",
    name: "Input OTP",
    category: "Text inputs",
    icon: "pin",
    origin: "shadcn",
    description: "One-time passcode entry, one box per digit.",
    imports: [
      {
        from: "input-otp",
        names: [
          "InputOTP",
          "InputOTPGroup",
          "InputOTPSlot",
          "InputOTPSeparator",
        ],
      },
    ],
  },
  {
    slug: "field",
    name: "Field",
    category: "Text inputs",
    icon: "list_alt",
    origin: "shadcn",
    description:
      "Lays out a label, a control, a description and an error message — the building block of forms.",
    imports: [
      {
        from: "field",
        names: [
          "Field",
          "FieldGroup",
          "FieldLabel",
          "FieldDescription",
          "FieldError",
          "FieldSet",
          "FieldLegend",
        ],
      },
    ],
    notes: ["This replaces the old shadcn Form component."],
  },
  {
    slug: "label",
    name: "Label",
    category: "Text inputs",
    icon: "sell",
    origin: "shadcn",
    description: "The text label of a control, in Body Large.",
    imports: [{ from: "label", names: ["Label"] }],
  },
]
