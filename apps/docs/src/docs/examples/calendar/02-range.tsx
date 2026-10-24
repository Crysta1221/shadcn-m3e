import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/components/m3e/calendar"

export const meta = {
  title: "Date range",
}

export default function Demo() {
  const [range, setRange] = React.useState<DateRange | undefined>()
  return (
    <div className="@container/calendar w-full">
      <Calendar
        className="[--cell-size:--spacing(8)] @sm/calendar:[--cell-size:--spacing(10)]"
        mode="range"
        selected={range}
        onSelect={setRange}
      />
    </div>
  )
}
