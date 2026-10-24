import { Skeleton } from "@/components/m3e/skeleton"

export const meta = {
  title: "A card placeholder",
}

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs items-center gap-4">
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}
