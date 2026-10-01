import { Button } from "@/components/m3e/button"
import { ButtonGroup } from "@/components/m3e/button-group"

export const meta = {
  title: "Standard",
  description: "Press a button: it expands and the others shrink to make room.",
}

export default function Demo() {
  return (
    <ButtonGroup variant="standard">
      <Button variant="tonal">Rewind</Button>
      <Button variant="filled">Play</Button>
      <Button variant="tonal">Forward</Button>
    </ButtonGroup>
  )
}
