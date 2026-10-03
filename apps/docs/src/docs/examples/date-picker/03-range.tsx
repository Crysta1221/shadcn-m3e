import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/m3e/button"
import { DatePickerModal } from "@/components/m3e/date-picker"
import { Icon } from "@/components/m3e/icon"

export const meta = {
  title: "Range",
  description: 'mode="range" picks a start and an end date.',
}

export default function Demo() {
  const [range, setRange] = React.useState<DateRange | undefined>()

  return (
    <div className="flex flex-col items-center gap-3">
      <DatePickerModal
        mode="range"
        trigger={
          <Button variant="tonal">
            <Icon name="date_range" />
            Pick dates
          </Button>
        }
        value={range}
        onConfirm={setRange}
      />
      <p className="text-body-small text-on-surface-variant">
        {range?.from && range.to
          ? `${range.from.toDateString()} – ${range.to.toDateString()}`
          : "No dates yet"}
      </p>
    </div>
  )
}
