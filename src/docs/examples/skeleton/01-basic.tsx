import { Skeleton } from "@/components/m3e/skeleton"

export const meta = {
  title: "A card placeholder",
}

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  )
}
