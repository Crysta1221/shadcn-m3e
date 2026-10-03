import * as React from "react"
import { cn } from "@/lib/m3e/cn"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-body-large text-on-surface select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-on-surface/38 peer-disabled:cursor-not-allowed peer-disabled:text-on-surface/38",
        className
      )}
      {...props}
    />
  )
}

export { Label }
