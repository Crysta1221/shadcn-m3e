import { Icon } from "@/components/m3e/icon"
import { Button } from "@/components/m3e/button"

export const meta = {
  title: "Icon buttons",
  description: "Icon-only sizes, in three widths.",
}

export default function Demo() {
  return (
    <>
      <Button size="icon" variant="tonal" width="narrow" aria-label="Narrow">
        <Icon name="add" />
      </Button>
      <Button size="icon" variant="tonal" aria-label="Default">
        <Icon name="add" />
      </Button>
      <Button size="icon" variant="tonal" width="wide" aria-label="Wide">
        <Icon name="add" />
      </Button>
      <Button size="icon-md" variant="filled" aria-label="Send">
        <Icon name="send" />
      </Button>
    </>
  )
}
