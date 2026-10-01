import { cn } from "@/lib/m3e/cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-surface-container-highest",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
