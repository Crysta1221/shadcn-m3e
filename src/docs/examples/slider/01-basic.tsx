import { Slider } from "@/components/m3e/slider"

export const meta = {
  title: "Value and range",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <Slider defaultValue={[40]} />
      <Slider defaultValue={[20, 70]} />
      <Slider defaultValue={[60]} disabled />
    </div>
  )
}
