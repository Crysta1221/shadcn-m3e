import * as React from "react"

import { DatePicker } from "@/components/m3e/date-picker"

export const meta = {
  title: "Docked",
  description:
    "A text field you can type a date into (mm/dd/yyyy), with the calendar in a popup.",
}

export default function Demo() {
  const [date, setDate] = React.useState<Date | undefined>()

  return (
    <div className="flex flex-col items-center gap-3">
      <DatePicker label="Birthday" value={date} onValueChange={setDate} />
      <p className="text-body-small text-on-surface-variant">
        {date ? date.toDateString() : "No date yet"}
      </p>
    </div>
  )
}
