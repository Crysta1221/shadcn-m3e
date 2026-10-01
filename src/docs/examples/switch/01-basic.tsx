import { Label } from "@/components/m3e/label"
import { Switch } from "@/components/m3e/switch"

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
    </>
  )
}
