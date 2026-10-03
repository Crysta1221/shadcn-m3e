"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "@/lib/m3e/cn"

import { Ripple } from "@/components/m3e/ripple"

/* M3 checkbox: 18dp box, 2dp outline, 40dp circular state layer */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox state-layer-circle relative flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-[2px] border-2 border-on-surface-variant text-on-primary transition-shape outline-none state-layer-on-surface",
        "after:absolute after:-inset-[15px] focus-visible:outline-3 focus-visible:outline-offset-11 focus-visible:outline-secondary",
        "data-indeterminate:border-primary data-indeterminate:bg-primary data-checked:border-primary data-checked:bg-primary data-checked:state-layer-primary",
        "aria-invalid:border-error aria-invalid:state-layer-error aria-invalid:data-checked:border-error aria-invalid:data-checked:bg-error",
        "data-disabled:cursor-not-allowed data-disabled:border-on-surface/38 data-disabled:data-checked:border-transparent data-disabled:data-checked:bg-on-surface/38",
        className
      )}
      {...props}
    >
      <Ripple className="inset-auto top-1/2 left-1/2 size-10 -translate-1/2 rounded-full ripple-on-surface group-data-checked/checkbox:ripple-primary" />
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        keepMounted
        className="grid place-content-center text-current"
      >
        <svg
          viewBox="0 0 18 18"
          className="size-[18px] fill-none stroke-current stroke-2 [stroke-linecap:square]"
        >
          {/* check: draws in on select */}
          <path
            d="M3.5 9.2 7.2 12.8 14.6 5.4"
            pathLength={1}
            className="transition-[stroke-dashoffset] duration-(--md-sys-motion-spring-default-effects-duration) ease-emphasized-decelerate [stroke-dasharray:1] [stroke-dashoffset:1] group-data-indeterminate/checkbox:hidden group-data-checked/checkbox:[stroke-dashoffset:0]"
          />
          <path
            d="M4 9h10"
            className="hidden group-data-indeterminate/checkbox:block"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
