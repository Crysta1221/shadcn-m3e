import { Checkbox } from "@/components/m3e/checkbox"
import { Label } from "@/components/m3e/label"

export const meta = {
  title: "Basic",
}

export default function Demo() {
  return (
    <>
      <Label>
        <Checkbox defaultChecked /> Accept terms
      </Label>
      <Label>
        <Checkbox /> Subscribe
      </Label>
      <Label>
        <Checkbox indeterminate /> Some selected
      </Label>
      <Label>
        <Checkbox aria-invalid /> Error
      </Label>
      <Label>
        <Checkbox disabled /> Disabled
      </Label>
    </>
  )
}
