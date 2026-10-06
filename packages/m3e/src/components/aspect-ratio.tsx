import { cn } from "@/lib/m3e/cn"

function AspectRatio({
  ratio,
  className,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      // custom properties: React's CSSProperties has no `--*` keys
      // oxlint-disable-next-line no-unsafe-type-assertion
      style={{ "--ratio": ratio } as React.CSSProperties}
      className={cn("relative aspect-(--ratio)", className)}
      {...props}
    />
  )
}

export { AspectRatio }
