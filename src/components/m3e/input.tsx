import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 text field container.
 *  outlined: 1dp outline, 2dp primary outline on focus, extra-small corners
 *  filled:   surface-container-highest with an active-indicator underline
 * The 2dp focus stroke is an inset shadow, so nothing shifts on focus.
 */
const inputVariants = cva(
  "w-full min-w-0 text-body-large text-on-surface caret-primary transition-shape outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-label-large file:text-on-surface placeholder:text-on-surface-variant disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-on-surface/38",
  {
    variants: {
      variant: {
        outlined:
          "rounded-xs border border-outline bg-transparent hover:border-on-surface focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--md-sys-color-primary)] disabled:border-on-surface/12 aria-invalid:border-error aria-invalid:focus-visible:shadow-[inset_0_0_0_1px_var(--md-sys-color-error)]",
        filled:
          "rounded-t-xs border-0 border-b border-on-surface-variant bg-surface-container-highest hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,var(--md-sys-color-surface-container-highest))] focus-visible:border-primary focus-visible:shadow-[inset_0_-1px_0_0_var(--md-sys-color-primary)] disabled:border-on-surface/38 disabled:bg-on-surface/4 aria-invalid:border-error",
      },
      size: {
        default: "h-14 px-4 py-2",
        sm: "h-10 px-3 py-1 text-body-medium",
      },
    },
    defaultVariants: { variant: "outlined", size: "default" },
  }
)

function Input({
  className,
  type,
  variant,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
