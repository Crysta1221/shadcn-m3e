import { TextField } from "@/components/m3e/text-field"

export const meta = {
  title: "Outlined and filled",
  description: "Focus a field: the label floats up.",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField label="Outlined" supportingText="Supporting text" />
      <TextField
        variant="filled"
        label="Filled"
        supportingText="Supporting text"
      />
    </div>
  )
}
