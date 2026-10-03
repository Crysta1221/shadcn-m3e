import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/m3e/cn"

import { inputVariants } from "@/components/m3e/input"

function Textarea({
  className,
  variant,
  ...props
}: React.ComponentProps<"textarea"> &
  Pick<VariantProps<typeof inputVariants>, "variant">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        inputVariants({ variant }),
        "flex field-sizing-content h-auto min-h-24 resize-none px-4 py-4",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
