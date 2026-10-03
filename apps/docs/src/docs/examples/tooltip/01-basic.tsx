import { Button } from "@/components/m3e/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/m3e/tooltip"

export const meta = {
  title: "Plain tooltip",
}

export default function Demo() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outlined" />}>
        Hover me
      </TooltipTrigger>
      <TooltipContent>Add to library</TooltipContent>
    </Tooltip>
  )
}
