import { Icon } from "@/components/m3e/icon"
import { ToggleGroup, ToggleGroupItem } from "@/components/m3e/toggle-group"

export const meta = {
  title: "Standard",
  description: "Press one: it widens by 15% and its neighbours make room.",
}

export default function Demo() {
  return (
    <ToggleGroup defaultValue={["center"]}>
      <ToggleGroupItem value="left" variant="filled" aria-label="Align left">
        <Icon name="format_align_left" size={20} />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="center"
        variant="filled"
        aria-label="Align center"
      >
        <Icon name="format_align_center" size={20} />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" variant="filled" aria-label="Align right">
        <Icon name="format_align_right" size={20} />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
