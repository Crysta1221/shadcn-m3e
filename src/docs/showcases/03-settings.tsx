import { Button } from "@/components/m3e/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/m3e/card"
import { Label } from "@/components/m3e/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/m3e/select"
import { Slider } from "@/components/m3e/slider"
import { Switch } from "@/components/m3e/switch"
import { TextField } from "@/components/m3e/text-field"

export const meta = {
  title: "Settings form",
  description:
    "A card holding a text field, a select, switches and a slider, with its actions in the footer.",
  layout: "block",
  uses: ["card", "text-field", "select", "switch", "slider", "button"],
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "de", label: "Deutsch" },
]

export default function Demo() {
  return (
    <Card variant="outlined" className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Profile and notifications</CardTitle>
        <CardDescription>How you appear and what we tell you.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <TextField
          label="Display name"
          defaultValue="John"
          supportingText="Shown next to your comments."
        />
        <Select defaultValue="en" items={LANGUAGES}>
          <SelectTrigger className="w-full" aria-label="Language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-col gap-3">
          <Label className="justify-between">
            Email me about replies <Switch defaultChecked />
          </Label>
          <Label className="justify-between">
            Weekly summary <Switch />
          </Label>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-label-large text-on-surface">
            Notification volume
          </span>
          <Slider defaultValue={[60]} aria-label="Notification volume" />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="text">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  )
}
