import { Icon } from "@/components/m3e/icon"
import { Label } from "@/components/m3e/label"
import { CheckedIcon, Switch, UncheckedIcon } from "@/components/m3e/switch"

export const meta = {
  title: "Basic",
  description: "Press and hold a switch to see the handle grow.",
}

export default function Demo() {
  return (
    <>
      <Label>
        <Switch defaultChecked /> Wi-Fi
      </Label>
      <Label>
        <Switch /> Bluetooth
      </Label>
      <Label>
        <Switch size="sm" defaultChecked /> Compact
      </Label>
      <Label>
        <Switch disabled /> Disabled
      </Label>
      <Label>
        <Switch>
          <CheckedIcon />
          <UncheckedIcon />
        </Switch>
        State icons
      </Label>
      <Label>
        <Switch defaultChecked>
          <CheckedIcon />
        </Switch>
        Only checked icon
      </Label>
      <Label>
        <Switch>
          <CheckedIcon />
          <UncheckedIcon>
            <Icon name="check_indeterminate_small" />
          </UncheckedIcon>
        </Switch>
        Custom icon
      </Label>
    </>
  )
}
