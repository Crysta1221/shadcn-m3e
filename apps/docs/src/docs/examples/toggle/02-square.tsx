import { Toggle } from "@/components/m3e/toggle"

export const meta = {
  title: "Square shape",
  description: "A square toggle turns round when selected.",
}

export default function Demo() {
  return (
    <>
      <Toggle size="md" variant="filled" shape="square">
        Square
      </Toggle>
      <Toggle size="md" variant="filled" defaultPressed>
        Round
      </Toggle>
    </>
  )
}
