import * as React from "react"

import { Button } from "@/components/m3e/button"
import { DatePickerModal } from "@/components/m3e/date-picker"
import { Icon } from "@/components/m3e/icon"

export const meta = {
  title: "Modal",
  description:
    "Pick with OK. The month row opens the years; the pencil in the header switches to typing.",
}

export default function Demo() {
  const [date, setDate] = React.useState<Date | undefined>()

  return (
    <div className="flex flex-col items-center gap-3">
      <DatePickerModal
        trigger={
          <Button variant="tonal">
            <Icon name="calendar_today" />
            Pick a date
          </Button>
        }
        value={date}
        onConfirm={setDate}
      />
      <p className="text-body-small text-on-surface-variant">
        {date ? date.toDateString() : "No date yet"}
      </p>
    </div>
  )
}
