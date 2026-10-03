import { ScrollArea } from "@/components/m3e/scroll-area"

export const meta = {
  title: "Vertical",
}

export default function Demo() {
  return (
    <ScrollArea className="h-48 w-64 rounded-md border border-outline-variant">
      <div className="flex flex-col gap-2 p-4 text-body-medium text-on-surface">
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i}>Item {i + 1}</span>
        ))}
      </div>
    </ScrollArea>
  )
}
