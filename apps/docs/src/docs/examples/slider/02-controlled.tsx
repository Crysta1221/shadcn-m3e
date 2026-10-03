import * as React from "react"

import { Slider } from "@/components/m3e/slider"

export const meta = {
  title: "Controlled",
  layout: "block",
}

export default function Demo() {
  const [value, setValue] = React.useState(30)
  return (
    <div className="flex max-w-md flex-col gap-2">
      <Slider
        value={[value]}
        onValueChange={(v) => setValue(Array.isArray(v) ? v[0] : v)}
        min={0}
        max={100}
        step={5}
      />
      <p className="text-body-medium text-on-surface-variant">Value: {value}</p>
    </div>
  )
}
