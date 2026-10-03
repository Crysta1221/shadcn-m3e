import { Icon } from "@/components/m3e/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/m3e/input-group"

export const meta = {
  title: "With add-ons",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <Icon name="search" size={20} />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." />
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="example.com" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
