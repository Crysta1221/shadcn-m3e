import { Button } from "@/components/m3e/button"

export const meta = {
  title: "Variants",
  description: "Filled is the strongest, text the quietest.",
}

export default function Demo() {
  return (
    <>
      <Button variant="filled">Filled</Button>
      <Button variant="tonal">Tonal</Button>
      <Button variant="elevated">Elevated</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
      <Button disabled>Disabled</Button>
    </>
  )
}
