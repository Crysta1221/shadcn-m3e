import * as React from "react"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import {
  SideSheet,
  SideSheetContent,
  SideSheetHeader,
} from "@/components/m3e/side-sheet"

export const meta = {
  title: "Detached, on the left, with a back button",
  description:
    "detached floats the sheet 16dp from the edges with rounded corners. onBack adds a back button.",
  layout: "block",
}

export default function Demo() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="flex h-96 overflow-hidden rounded-lg border border-outline-variant">
      <SideSheet open={open} side="left" detached width={300}>
        <SideSheetHeader
          title="Details"
          onBack={() => setOpen(false)}
          onClose={() => setOpen(false)}
        />
        <SideSheetContent>
          <p>Only the sheet is rounded; the page behind it stays flat.</p>
        </SideSheetContent>
      </SideSheet>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-3 p-6">
        <Button variant="tonal" onClick={() => setOpen((o) => !o)}>
          <Icon name="info" />
          {open ? "Close details" : "Details"}
        </Button>
      </div>
    </div>
  )
}
