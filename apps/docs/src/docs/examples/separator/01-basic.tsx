import { Separator } from "@/components/m3e/separator"

export const meta = {
  title: "Horizontal and vertical",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex max-w-sm flex-col gap-3 text-body-medium text-on-surface">
      <span>Above</span>
      <Separator />
      <span>Below</span>
      <div className="flex h-6 items-center gap-3">
        <span>One</span>
        <Separator orientation="vertical" />
        <span>Two</span>
        <Separator orientation="vertical" />
        <span>Three</span>
      </div>
    </div>
  )
}
