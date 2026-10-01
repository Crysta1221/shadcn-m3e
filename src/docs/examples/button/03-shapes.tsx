import { Button } from "@/components/m3e/button"

export const meta = {
  title: "Shapes",
  description: "Press and hold a button to see the corners morph.",
}

export default function Demo() {
  return (
    <>
      <Button size="md" shape="round">
        Round
      </Button>
      <Button size="md" shape="square">
        Square
      </Button>
      <Button size="md" variant="tonal" shape="square">
        Tonal square
      </Button>
    </>
  )
}
