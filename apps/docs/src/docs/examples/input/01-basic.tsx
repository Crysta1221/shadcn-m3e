import { Input } from "@/components/m3e/input"

export const meta = {
  title: "Outlined and filled",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-4">
      <Input aria-label="Example text" placeholder="Outlined" />
      <Input aria-label="Example text" variant="filled" placeholder="Filled" />
      <Input aria-label="Example text" size="sm" placeholder="Small" />
      <Input aria-label="Example text" disabled placeholder="Disabled" />
    </div>
  )
}
