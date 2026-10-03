import * as React from "react"
import { cn } from "@/lib/m3e/cn"
import { ArrowDropDownIcon } from "@/components/m3e/symbols"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="h-14 w-full min-w-0 appearance-none rounded-xs border border-outline bg-transparent py-1 pr-11 pl-4 text-body-large text-on-surface transition-shape outline-none select-none hover:border-on-surface focus-visible:border-primary focus-visible:shadow-[inset_0_0_0_1px_var(--md-sys-color-primary)] disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-error data-[size=sm]:h-10 data-[size=sm]:text-body-medium"
        {...props}
      />
      <ArrowDropDownIcon
        className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-on-surface-variant select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
