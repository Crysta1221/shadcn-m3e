import { Icon } from "@/components/m3e/icon"
import { Toggle } from "@/components/m3e/toggle"

export const meta = {
  title: "Standard and filled",
  description: '`fill="auto"` fills the icon while the toggle is selected.',
}

export default function Demo() {
  return (
    <>
      <Toggle aria-label="Favorite">
        <Icon name="favorite" fill="auto" />
      </Toggle>
      <Toggle variant="filled" aria-label="Bookmark">
        <Icon name="bookmark" fill="auto" />
      </Toggle>
      <Toggle variant="tonal">Tonal</Toggle>
      <Toggle variant="outline">Outlined</Toggle>
    </>
  )
}
