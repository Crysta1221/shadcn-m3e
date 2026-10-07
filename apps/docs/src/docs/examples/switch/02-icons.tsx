import { Icon } from "@/components/m3e/icon"
import { Label } from "@/components/m3e/label"
import { CheckedIcon, Switch, UncheckedIcon } from "@/components/m3e/switch"

export const meta = {
  title: "Icons",
  description:
    "Ability to have an optional icon within the switch handle. Custom icons need a gen:icons pass so the glyph is bundled.",
}

export default function Demo() {
  return (
    <>
      <Label>
        <Switch>
          <CheckedIcon />
          <UncheckedIcon />
        </Switch>
        Checked and unchecked icons
      </Label>
      <Label>
        <Switch defaultChecked>
          <CheckedIcon />
        </Switch>
        Only checked icon
      </Label>
      <Label>
        <Switch size="sm">
          <CheckedIcon />
          <UncheckedIcon />
        </Switch>
        Compact with icons
      </Label>
      <Label>
        <Switch>
          <CheckedIcon />
          <UncheckedIcon>
            {/* Requires bun run gen:icons so check_indeterminate_small is bundled */}
            <Icon name="check_indeterminate_small" />
          </UncheckedIcon>
        </Switch>
        Custom icon
      </Label>
    </>
  )
}
