import { Icon } from "@/components/m3e/icon"
import { Button } from "@/components/m3e/button"
import { ButtonGroup } from "@/components/m3e/button-group"

export const meta = {
  title: "Connected",
  description: "Fused corners: small on the inside, full on the ends.",
}

export default function Demo() {
  return (
    <ButtonGroup>
      <Button variant="tonal" aria-label="Bold">
        <Icon name="format_bold" size={20} />
      </Button>
      <Button variant="tonal" aria-label="Italic">
        <Icon name="format_italic" size={20} />
      </Button>
      <Button variant="tonal" aria-label="Underline">
        <Icon name="format_underlined" size={20} />
      </Button>
    </ButtonGroup>
  )
}
