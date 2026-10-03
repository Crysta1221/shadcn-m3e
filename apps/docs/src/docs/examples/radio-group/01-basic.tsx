import { Label } from "@/components/m3e/label"
import { RadioGroup, RadioGroupItem } from "@/components/m3e/radio-group"

export const meta = {
  title: "Basic",
}

export default function Demo() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <Label>
        <RadioGroupItem value="default" /> Default
      </Label>
      <Label>
        <RadioGroupItem value="comfortable" /> Comfortable
      </Label>
      <Label>
        <RadioGroupItem value="compact" /> Compact
      </Label>
    </RadioGroup>
  )
}
