import { Icon } from "@/components/m3e/icon"
import { TextField } from "@/components/m3e/text-field"

export const meta = {
  title: "Error and multiline",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-4">
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
