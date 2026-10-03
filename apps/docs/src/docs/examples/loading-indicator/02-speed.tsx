import * as React from "react"

import { Label } from "@/components/m3e/label"
import { LoadingIndicator } from "@/components/m3e/loading-indicator"
import { Slider } from "@/components/m3e/slider"

export const meta = {
  title: "Speed",
  description: "1 is the spec. Drag to slow it down, speed it up or pause it.",
  layout: "block",
}

export default function Demo() {
  const [speed, setSpeed] = React.useState(1)
  return (
    <div className="flex max-w-md flex-col gap-4">
      <div className="flex items-center gap-6">
        <LoadingIndicator speed={speed} />
        <LoadingIndicator variant="contained" speed={speed} />
        <LoadingIndicator size={96} speed={speed} />
      </div>
      <Label className="flex-col items-stretch gap-2">
        Speed ×{speed.toFixed(2)}
        <Slider
          min={0}
          max={3}
          step={0.25}
          value={[speed]}
          onValueChange={(v) => setSpeed(Array.isArray(v) ? v[0] : v)}
          aria-label="Speed"
        />
      </Label>
    </div>
  )
}
