import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { FloatingToolbar } from "@/components/m3e/toolbar"
import { Toggle } from "@/components/m3e/toggle"

export const meta = {
  title: "Standard, vibrant and vertical",
}

export default function Demo() {
  return (
    <>
      <FloatingToolbar>
        <Button variant="text" size="icon" aria-label="Undo">
          <Icon name="undo" />
        </Button>
        <Button variant="text" size="icon" aria-label="Redo">
          <Icon name="redo" />
        </Button>
        <Toggle aria-label="Bold" defaultPressed>
          <Icon name="format_bold" />
        </Toggle>
        <Toggle aria-label="Italic">
          <Icon name="format_italic" />
        </Toggle>
      </FloatingToolbar>
      <FloatingToolbar variant="vibrant">
        <Button variant="text" size="icon" aria-label="Undo">
          <Icon name="undo" />
        </Button>
        <Toggle aria-label="Bold" defaultPressed>
          <Icon name="format_bold" />
        </Toggle>
      </FloatingToolbar>
      <FloatingToolbar orientation="vertical">
        <Button variant="text" size="icon" aria-label="Undo">
          <Icon name="undo" />
        </Button>
        <Button variant="text" size="icon" aria-label="Redo">
          <Icon name="redo" />
        </Button>
      </FloatingToolbar>
    </>
  )
}
