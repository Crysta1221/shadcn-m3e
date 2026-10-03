import { Input } from "@/components/m3e/input"

export const meta = {
  title: "Outlined and filled",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input placeholder="Outlined" />
      <Input variant="filled" placeholder="Filled" />
      <Input size="sm" placeholder="Small" />
      <Input disabled placeholder="Disabled" />
    </div>
  )
}
