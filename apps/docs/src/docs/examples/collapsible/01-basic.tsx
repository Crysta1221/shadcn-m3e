import { Button } from "@/components/m3e/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/m3e/collapsible"

export const meta = {
  title: "Basic",
}

export default function Demo() {
  return (
    <Collapsible className="flex w-64 flex-col gap-2">
      <CollapsibleTrigger render={<Button variant="tonal" />}>
        Toggle details
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-md bg-surface-container p-3 text-body-medium text-on-surface">
        Here are the details that were hidden.
      </CollapsibleContent>
    </Collapsible>
  )
}
