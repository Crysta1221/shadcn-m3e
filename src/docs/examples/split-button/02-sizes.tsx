import { SplitButton } from "@/components/m3e/split-button"

export const meta = {
  title: "Sizes and styles",
}

export default function Demo() {
  return (
    <>
      <SplitButton size="xs" variant="outlined">
        Extra small
      </SplitButton>
      <SplitButton variant="tonal">Small</SplitButton>
      <SplitButton size="md" variant="elevated">
        Medium
      </SplitButton>
    </>
  )
}
