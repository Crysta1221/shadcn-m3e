import { Checkbox } from "@/components/m3e/checkbox"
import { Label } from "@/components/m3e/label"

export const meta = {
  title: "With a control",
}

export default function Demo() {
  return (
    <Label htmlFor="label-terms">
      <Checkbox id="label-terms" /> Accept terms and conditions
    </Label>
  )
}
