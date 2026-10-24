import { Icon } from "@/components/m3e/icon"
import { TextField } from "@/components/m3e/text-field"

export const meta = {
  title: "Icons, prefix and suffix",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-4">
      <TextField
        label="Search"
        leadingIcon={<Icon name="search" />}
        trailingIcon={<Icon name="cancel" />}
      />
      <TextField label="Amount" prefix="$" suffix="USD" />
    </div>
  )
}
