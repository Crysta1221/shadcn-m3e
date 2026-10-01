import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/m3e/cn"

import { Ripple } from "@/components/m3e/ripple"

/*
 * M3 Expressive button.
 *
 * Icon sizes (icon-*) also take width="narrow" | "wide" (M3E icon button widths).
 *
 * Each size sets three corner radii as CSS variables:
 *   --btn-r          resting corner (round = half the height, square = size-specific)
 *   --btn-r-pressed  corner while pressed (the M3E shape morph)
 *   --btn-r-selected corner of a selected toggle (round ↔ square swap)
 */
const buttonVariants = cva(
  "group/button state-layer relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-(--btn-r) border border-transparent whitespace-nowrap focus-ring transition-shape outline-none select-none disabled:pointer-events-none disabled:cursor-default disabled:border-transparent! disabled:bg-on-surface/10! disabled:text-on-surface/38! disabled:shadow-none! aria-invalid:border-error data-press:rounded-(--btn-r-pressed) [&_svg]:pointer-events-none [&_svg]:shrink-0 [&>*:not([data-slot=ripple])]:relative [&>*:not([data-slot=ripple])]:z-1",
  {
    variants: {
      variant: {
        /* M3 names */
        filled:
          "bg-primary text-on-primary hover:shadow-elevation-1 data-press:shadow-none",
        tonal:
          "bg-secondary-container text-on-secondary-container hover:shadow-elevation-1 data-press:shadow-none",
        elevated:
          "bg-surface-container-low text-primary shadow-elevation-1 hover:shadow-elevation-2 data-press:shadow-elevation-1",
        outlined:
          "border-outline-variant bg-transparent text-on-surface-variant disabled:border-on-surface/12!",
        text: "bg-transparent text-primary disabled:bg-transparent!",
        /* shadcn names */
        default:
          "bg-primary text-on-primary hover:shadow-elevation-1 data-press:shadow-none",
        secondary:
          "bg-secondary-container text-on-secondary-container hover:shadow-elevation-1 data-press:shadow-none",
        tertiary:
          "bg-tertiary-container text-on-tertiary-container hover:shadow-elevation-1 data-press:shadow-none",
        outline:
          "border-outline-variant bg-transparent text-on-surface-variant disabled:border-on-surface/12! aria-expanded:bg-on-surface-variant/8",
        ghost:
          "bg-transparent text-on-surface-variant disabled:bg-transparent! aria-expanded:bg-on-surface-variant/8",
        destructive:
          "bg-error text-on-error hover:shadow-elevation-1 data-press:shadow-none",
        link: "state-layer-transparent bg-transparent text-primary underline-offset-4 hover:underline disabled:bg-transparent!",
      },
      size: {
        xs: "h-8 gap-2 px-4 text-label-large [--btn-h2:16px] [--btn-r-pressed:var(--radius-sm)] [--btn-r-square:var(--radius-md)] [--btn-r:16px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-5",
        sm: "h-10 gap-2 px-4 text-label-large [--btn-h2:20px] [--btn-r-pressed:var(--radius-sm)] [--btn-r-square:var(--radius-md)] [--btn-r:20px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-5",
        default:
          "h-10 gap-2 px-4 text-label-large [--btn-h2:20px] [--btn-r-pressed:var(--radius-sm)] [--btn-r-square:var(--radius-md)] [--btn-r:20px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-5",
        md: "h-14 gap-2 px-6 text-title-medium [--btn-h2:28px] [--btn-r-pressed:var(--radius-md)] [--btn-r-square:var(--radius-lg)] [--btn-r:28px] has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-6",
        lg: "h-24 gap-3 px-12 text-headline-small [--btn-h2:48px] [--btn-r-pressed:var(--radius-lg)] [--btn-r-square:var(--radius-2xl)] [--btn-r:48px] data-[variant=outline]:border-2 data-[variant=outlined]:border-2 [&_svg:not([class*='size-'])]:size-8",
        xl: "h-34 gap-4 px-16 text-headline-large [--btn-h2:68px] [--btn-r-pressed:var(--radius-lg)] [--btn-r-square:var(--radius-2xl)] [--btn-r:68px] data-[variant=outline]:border-3 data-[variant=outlined]:border-3 [&_svg:not([class*='size-'])]:size-10",
        /* icon buttons */
        "icon-xs":
          "size-8 [--btn-h2:16px] [--btn-r-pressed:var(--radius-sm)] [--btn-r-square:var(--radius-md)] [--btn-r:16px] [&_svg:not([class*='size-'])]:size-5",
        "icon-sm":
          "size-10 [--btn-h2:20px] [--btn-r-pressed:var(--radius-sm)] [--btn-r-square:var(--radius-md)] [--btn-r:20px] [&_svg:not([class*='size-'])]:size-6",
        icon: "size-10 [--btn-h2:20px] [--btn-r-pressed:var(--radius-sm)] [--btn-r-square:var(--radius-md)] [--btn-r:20px] [&_svg:not([class*='size-'])]:size-6",
        "icon-md":
          "size-14 [--btn-h2:28px] [--btn-r-pressed:var(--radius-md)] [--btn-r-square:var(--radius-lg)] [--btn-r:28px] [&_svg:not([class*='size-'])]:size-6",
        "icon-lg":
          "size-24 [--btn-h2:48px] [--btn-r-pressed:var(--radius-lg)] [--btn-r-square:var(--radius-2xl)] [--btn-r:48px] [&_svg:not([class*='size-'])]:size-8",
        "icon-xl":
          "size-34 [--btn-h2:68px] [--btn-r-pressed:var(--radius-lg)] [--btn-r-square:var(--radius-2xl)] [--btn-r:68px] [&_svg:not([class*='size-'])]:size-10",
      },
      shape: {
        round: "",
        square: "[--btn-r:var(--btn-r-square)]",
      },
      /* icon buttons: M3E offers three widths at every size */
      width: {
        default: "",
        narrow: "",
        wide: "",
      },
    },
    compoundVariants: [
      { size: "icon-xs", width: "narrow", className: "w-[28px]!" },
      { size: "icon-xs", width: "wide", className: "w-[40px]!" },
      { size: "icon-sm", width: "narrow", className: "w-[32px]!" },
      { size: "icon-sm", width: "wide", className: "w-[52px]!" },
      { size: "icon", width: "narrow", className: "w-[32px]!" },
      { size: "icon", width: "wide", className: "w-[52px]!" },
      { size: "icon-md", width: "narrow", className: "w-[48px]!" },
      { size: "icon-md", width: "wide", className: "w-[72px]!" },
      { size: "icon-lg", width: "narrow", className: "w-[64px]!" },
      { size: "icon-lg", width: "wide", className: "w-[128px]!" },
      { size: "icon-xl", width: "narrow", className: "w-[104px]!" },
      { size: "icon-xl", width: "wide", className: "w-[184px]!" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "round",
      width: "default",
    },
  }
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    disableRipple?: boolean
  }

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "round",
  width = "default",
  disableRipple,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, shape, width, className }))}
      {...props}
    >
      <Ripple disabled={disableRipple || variant === "link"} />
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
