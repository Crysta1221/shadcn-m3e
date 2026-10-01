import * as React from "react"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import {
  SideSheet,
  SideSheetContent,
  SideSheetFooter,
  SideSheetHeader,
} from "@/components/m3e/side-sheet"

export const meta = {
  title: "Standard",
  description:
    "Sits beside the content and shares the window with it: opening it reflows the page on the spatial spring.",
  layout: "block",
}

export default function Demo() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="flex h-96 overflow-hidden rounded-lg border border-outline-variant">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-3 p-6">
        <h3 className="text-title-medium text-on-surface">Inbox</h3>
        <p className="text-body-medium text-on-surface-variant">
          The list keeps its place; only its width changes.
        </p>
        <Button variant="tonal" onClick={() => setOpen((o) => !o)}>
          <Icon name="tune" />
          {open ? "Hide filters" : "Filters"}
        </Button>
      </div>
      <SideSheet open={open}>
        <SideSheetHeader title="Filters" onClose={() => setOpen(false)} />
        <SideSheetContent>
          <p>Narrow the messages down by sender, date or label.</p>
        </SideSheetContent>
        <SideSheetFooter>
          <Button onClick={() => setOpen(false)}>Apply</Button>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </SideSheetFooter>
      </SideSheet>
    </div>
  )
}
