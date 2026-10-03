import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/m3e/native-select"

export const meta = {
  title: "Basic",
}

export default function Demo() {
  return (
    <NativeSelect className="w-56" defaultValue="b">
      <NativeSelectOption value="a">Option A</NativeSelectOption>
      <NativeSelectOption value="b">Option B</NativeSelectOption>
      <NativeSelectOption value="c">Option C</NativeSelectOption>
    </NativeSelect>
  )
}
