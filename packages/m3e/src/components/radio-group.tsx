import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "@/lib/m3e/cn"

import { Ripple } from "@/components/m3e/ripple"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-4", className)}
      {...props}
    />
  )
}

/* M3 radio button: 20dp ring, 10dp dot, 40dp circular state layer */
function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer state-layer-circle relative flex aspect-square size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-on-surface-variant transition-shape outline-none state-layer-on-surface",
        "after:absolute after:-inset-[14px] focus-visible:outline-3 focus-visible:outline-offset-10 focus-visible:outline-secondary",
        "data-checked:border-primary data-checked:state-layer-primary",
        "aria-invalid:border-error",
        "data-disabled:cursor-not-allowed data-disabled:border-on-surface/38",
        className
      )}
      {...props}
    >
      <Ripple className="inset-auto top-1/2 left-1/2 size-10 -translate-1/2 rounded-full ripple-on-surface group-data-checked/radio-group-item:ripple-primary" />
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        keepMounted
        className="size-2.5 scale-0 rounded-full bg-primary transition-transform duration-(--md-sys-motion-spring-fast-spatial-duration) ease-spatial-fast group-aria-invalid/radio-group-item:bg-error group-data-disabled/radio-group-item:bg-on-surface/38 data-checked:scale-100"
      />
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
