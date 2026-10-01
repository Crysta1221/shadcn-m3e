import { Icon } from "@/components/m3e/icon"
import { TextField } from "@/components/m3e/text-field"

export const meta = {
  title: "Error and multiline",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField
        variant="filled"
        label="Email"
        defaultValue="not an email"
        error
        errorText="Enter a valid email"
        trailingIcon={<Icon name="error" />}
      />
      <TextField label="Message" multiline rows={3} />
    </div>
  )
}
