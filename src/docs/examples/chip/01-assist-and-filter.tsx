import { Chip, FilterChip } from "@/components/m3e/chip"

export const meta = {
  title: "Assist and filter",
  description: "A filter chip shows a check when selected.",
}

export default function Demo() {
  return (
    <>
      <Chip icon="event">Add to calendar</Chip>
      <Chip variant="elevated" icon="directions">
        Directions
      </Chip>
      <FilterChip defaultPressed>Nearby</FilterChip>
      <FilterChip>Open now</FilterChip>
    </>
  )
}
