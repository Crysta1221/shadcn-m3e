import { Icon } from "@/components/m3e/icon"
import { Button } from "@/components/m3e/button"

export const meta = {
  title: "Sizes",
  description:
    "Extra small to large; the icon, gap and label scale with the height.",
}

export default function Demo() {
  return (
    <>
      <Button size="xs">
        <Icon name="add" size={20} />
        XS
      </Button>
      <Button size="sm">
        <Icon name="add" size={20} />
        Small
      </Button>
      <Button size="md">
        <Icon name="add" />
        Medium
      </Button>
      <Button size="lg">
        <Icon name="add" size={32} />
        Large
      </Button>
    </>
  )
}
