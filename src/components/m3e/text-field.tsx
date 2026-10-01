import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/m3e/cn"

/*
 * M3 text field with a floating label (Compose Filled/OutlinedTextField
 * tokens):
 *   outlined — 56dp, extra-small corners, 1dp outline (on-surface on hover),
 *              2dp primary on focus; the label floats into a notch
 *   filled   — surface-container-highest, extra-small top corners, 1dp active
 *              indicator (2dp primary on focus); the label floats to the top
 * Label: body large → body small. Supporting text: body small.
 * The label floats while focused or filled (`:placeholder-shown` tracks it).
 */
const fieldVariants = cva(
  "group/tf relative flex min-h-14 w-full items-center text-body-large text-on-surface transition-shape",
  {
    variants: {
      variant: {
        outlined: "",
        filled:
          "rounded-t-xs bg-surface-container-highest hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,var(--md-sys-color-surface-container-highest))]",
      },
    },
    defaultVariants: { variant: "outlined" },
  }
)

type TextFieldProps = Omit<React.ComponentProps<"input">, "size" | "prefix"> &
  VariantProps<typeof fieldVariants> & {
    label?: React.ReactNode
    supportingText?: React.ReactNode
    error?: boolean
    errorText?: React.ReactNode
    leadingIcon?: React.ReactNode
    trailingIcon?: React.ReactNode
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    /** grow into a textarea */
    multiline?: boolean
    rows?: number
    containerClassName?: string
  }

function TextField({
  variant = "outlined",
  label,
  supportingText,
  error,
  errorText,
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  multiline,
  rows = 3,
  className,
  containerClassName,
  id,
  disabled,
  placeholder,
  ...props
}: TextFieldProps) {
  const autoId = React.useId()
  const inputId = id ?? autoId
  const supportId = `${inputId}-support`
  const outlined = variant === "outlined"
  const support = error && errorText ? errorText : supportingText

  // floating: focused, or holding a value (the placeholder is not shown).
  // text-box-trim cuts the box to the glyph range so the label centers on the
  // outline for any font/size; top-[2px] is the fallback for older engines.
  const floated =
    "group-focus-within/tf:top-[2px] group-has-[:is(input,textarea):not(:placeholder-shown)]/tf:top-[2px] " +
    "supports-[text-box-trim:trim-both]:group-focus-within/tf:top-0! " +
    "supports-[text-box-trim:trim-both]:group-has-[:is(input,textarea):not(:placeholder-shown)]/tf:top-0! " +
    "group-focus-within/tf:text-body-small group-has-[:is(input,textarea):not(:placeholder-shown)]/tf:text-body-small"

  // outline color: rest, hover, focus, error
  const edge = error
    ? "border-error group-hover/tf:border-on-error-container group-focus-within/tf:border-error"
    : "border-outline group-hover/tf:border-on-surface group-focus-within/tf:border-primary"

  const inputClass = cn(
    "peer w-full min-w-0 flex-1 bg-transparent text-body-large text-on-surface caret-primary outline-none placeholder:text-on-surface-variant placeholder:opacity-0 focus:placeholder:opacity-100 disabled:cursor-not-allowed",
    label && !outlined ? "pt-6 pb-2" : "py-4",
    !leadingIcon && !prefix && "pl-4",
    !trailingIcon && !suffix && "pr-4",
    error && "caret-error",
    multiline && "field-sizing-content resize-none",
    className
  )

  const control = multiline ? (
    <textarea
      id={inputId}
      rows={rows}
      disabled={disabled}
      placeholder={placeholder ?? " "}
      aria-invalid={error || undefined}
      aria-describedby={support ? supportId : undefined}
      className={inputClass}
      // ref differs per element; the multiline branch swaps input for textarea
      // oxlint-disable-next-line no-unsafe-type-assertion
      {...(props as React.ComponentProps<"textarea">)}
    />
  ) : (
    <input
      id={inputId}
      disabled={disabled}
      placeholder={placeholder ?? " "}
      aria-invalid={error || undefined}
      aria-describedby={support ? supportId : undefined}
      className={inputClass}
      {...props}
    />
  )

  return (
    <div
      data-slot="text-field"
      data-variant={variant}
      data-error={error || undefined}
      data-disabled={disabled || undefined}
      className={cn("flex w-full flex-col gap-1", containerClassName)}
    >
      <div
        className={cn(
          fieldVariants({ variant }),
          multiline && "items-start",
          disabled && "pointer-events-none opacity-38"
        )}
      >
        {outlined ? (
          // The outline in three parts, as in Material Web: a start cap, a notch
          // the floating label sits in, and the rest. The notch is as wide as
          // a hidden copy of the label, so the gap follows the text whatever
          // the font is, and the border never depends on how a browser lays
          // out a <legend>.
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex"
          >
            <span
              className={cn(
                edge,
                "w-3 shrink-0 rounded-l-xs border-y border-l group-focus-within/tf:border-y-2 group-focus-within/tf:border-l-2"
              )}
            />
            {label && (
              <span
                className={cn(
                  edge,
                  "max-w-0 shrink-0 overflow-hidden border-b transition-[max-width] duration-100 group-focus-within/tf:max-w-full group-focus-within/tf:border-b-2",
                  "group-has-[:is(input,textarea):not(:placeholder-shown)]/tf:max-w-full"
                )}
              >
                <span className="invisible block px-1 text-body-small whitespace-nowrap">
                  {label}
                </span>
              </span>
            )}
            <span
              className={cn(
                edge,
                "min-w-0 flex-1 rounded-r-xs border-y border-r group-focus-within/tf:border-y-2 group-focus-within/tf:border-r-2"
              )}
            />
          </div>
        ) : (
          // filled: active indicator
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-on-surface-variant transition-shape",
              "group-focus-within/tf:h-0.5 group-focus-within/tf:bg-primary group-hover/tf:bg-on-surface",
              error &&
                "bg-error group-focus-within/tf:bg-error group-hover/tf:bg-on-error-container"
            )}
          />
        )}

        {leadingIcon && (
          <span className="flex shrink-0 items-center pr-4 pl-3 text-on-surface-variant [&_svg]:size-6">
            {leadingIcon}
          </span>
        )}
        {prefix && (
          <span className="shrink-0 pl-4 text-on-surface-variant opacity-0 transition-opacity group-focus-within/tf:opacity-100 group-has-[:is(input,textarea):not(:placeholder-shown)]/tf:opacity-100">
            {prefix}
          </span>
        )}

        <div className="relative flex min-w-0 flex-1 self-stretch">
          {control}
        </div>

        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 overflow-x-clip overflow-y-visible text-body-large text-ellipsis whitespace-nowrap text-on-surface-variant transition-all duration-150 ease-emphasized",
              // center glyphs, not the line box (multiline aligns on line 1).
              // Only the inline axis is clipped (for the ellipsis): with the box
              // trimmed to the cap height, clipping both would cut ascenders.
              !multiline &&
                "[text-box-edge:cap_alphabetic] [text-box-trim:trim-both]",
              // rests where the text starts (a prefix is hidden until focus)
              leadingIcon ? "left-13" : "left-4",
              trailingIcon ? "right-13" : "right-4",
              multiline && "top-7",
              // floated outlined labels land at the notch's start
              outlined
                ? cn(
                    floated,
                    "group-focus-within/tf:left-4 group-has-[:is(input,textarea):not(:placeholder-shown)]/tf:left-4",
                    "group-focus-within/tf:right-10 group-has-[:is(input,textarea):not(:placeholder-shown)]/tf:right-10"
                  )
                : "group-focus-within/tf:top-4 group-focus-within/tf:text-body-small group-has-[:is(input,textarea):not(:placeholder-shown)]/tf:top-4 group-has-[:is(input,textarea):not(:placeholder-shown)]/tf:text-body-small",
              "group-focus-within/tf:text-primary group-hover/tf:text-on-surface",
              error &&
                "text-error group-focus-within/tf:text-error group-hover/tf:text-on-error-container"
            )}
          >
            {label}
          </label>
        )}

        {suffix && (
          <span className="shrink-0 pr-4 text-on-surface-variant opacity-0 transition-opacity group-focus-within/tf:opacity-100 group-has-[:is(input,textarea):not(:placeholder-shown)]/tf:opacity-100">
            {suffix}
          </span>
        )}
        {trailingIcon && (
          <span
            className={cn(
              "flex shrink-0 items-center pr-3 pl-4 text-on-surface-variant [&_svg]:size-6",
              error && "text-error"
            )}
          >
            {trailingIcon}
          </span>
        )}
      </div>
      {support && (
        <p
          id={supportId}
          className={cn(
            "px-4 text-body-small text-on-surface-variant",
            error && "text-error"
          )}
        >
          {support}
        </p>
      )}
    </div>
  )
}

export { TextField }
