import { Chip, FilterChip, InputChip } from "@/components/m3e/chip"

export const meta = {
  title: "Sizes",
  description: "The standard 32dp chip and the roomier 40dp and 56dp ones.",
}

export default function Demo() {
  return (
    <>
      <Chip>32dp</Chip>
      <FilterChip size="md" defaultPressed>
        40dp
      </FilterChip>
      <InputChip size="lg" icon="person" onRemove={() => {}}>
        56dp
      </InputChip>
    </>
  )
}
