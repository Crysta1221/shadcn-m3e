import * as React from "react"

import { Calendar } from "@/components/m3e/calendar"

export const meta = {
  title: "Single date",
}

export default function Demo() {
  const [date, setDate] = React.useState<Date | undefined>(() => new Date())
  return (
    <div className="@container/calendar w-full">
      <Calendar
        className="[--cell-size:--spacing(8)] @sm/calendar:[--cell-size:--spacing(10)]"
        mode="single"
        selected={date}
        onSelect={setDate}
      />
    </div>
  )
}
