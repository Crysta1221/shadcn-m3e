import { Icon } from "@/components/m3e/icon"
import { Label } from "@/components/m3e/label"
import { Switch } from "@/components/m3e/switch"

export const meta = {
  title: "Icons",
  description:
    "Optional icons on the handle. Custom icons need a `gen:icons` pass so the glyph is bundled.",
}

export default function Demo() {
  return (
    <>
      <Label>
        <Switch icons />
        Checked and unchecked icons
      </Label>
      <Label>
        <Switch defaultChecked checkedIcon={<Icon name="check" />} />
        Only checked icon
      </Label>
      <Label>
        <Switch size="sm" icons />
        Compact with icons
      </Label>
      <Label>
        <Switch
          checkedIcon={<Icon name="check" />}
          // Requires `npm run gen:icons` so check_indeterminate_small is bundled
          uncheckedIcon={<Icon name="check_indeterminate_small" />}
        />
        Custom icon
      </Label>
    </>
  )
}
