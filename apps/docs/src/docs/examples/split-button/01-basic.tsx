import * as React from "react"

import { Icon } from "@/components/m3e/icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/m3e/dropdown-menu"
import { SplitButton } from "@/components/m3e/split-button"

export const meta = {
  title: "With a menu",
  description: "The trailing button opens a DropdownMenu.",
}

export default function Demo() {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <SplitButton
        open={open}
        renderTrailing={(button) => <DropdownMenuTrigger render={button} />}
      >
        <Icon name="edit" size={20} />
        Edit
      </SplitButton>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Share</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
