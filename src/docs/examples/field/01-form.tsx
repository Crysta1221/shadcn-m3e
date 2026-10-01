import { Button } from "@/components/m3e/button"
import { Checkbox } from "@/components/m3e/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/m3e/field"
import { Input } from "@/components/m3e/input"

export const meta = {
  title: "A small form",
  layout: "block",
}

export default function Demo() {
  return (
    <form className="max-w-sm" onSubmit={(e) => e.preventDefault()}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="field-email">Email</FieldLabel>
          <Input id="field-email" type="email" placeholder="you@example.com" />
          <FieldDescription>We will never share it.</FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="field-terms" />
          <FieldLabel htmlFor="field-terms">Accept the terms</FieldLabel>
        </Field>
        <Button type="submit">Submit</Button>
      </FieldGroup>
    </form>
  )
}
