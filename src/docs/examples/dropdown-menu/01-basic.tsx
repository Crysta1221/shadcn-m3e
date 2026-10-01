import { Button } from "@/components/m3e/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/m3e/dropdown-menu"

export const meta = {
  title: "With a checkbox item",
}

export default function Demo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outlined" />}>
        Open menu
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>Preview</DropdownMenuItem>
        <DropdownMenuItem>Share</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem defaultChecked>
          Show grid
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Snap to grid</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
