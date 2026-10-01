import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { DockedToolbar } from "@/components/m3e/toolbar"

export const meta = {
  title: "Docked",
  layout: "block",
}

export default function Demo() {
  return (
    <DockedToolbar className="max-w-md">
      {["attach_file", "image", "mic", "more_vert"].map((icon) => (
        <Button key={icon} variant="text" size="icon" aria-label={icon}>
          <Icon name={icon} />
        </Button>
      ))}
    </DockedToolbar>
  )
}
