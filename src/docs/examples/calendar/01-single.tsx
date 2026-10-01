import * as React from "react"

import { Calendar } from "@/components/m3e/calendar"

export const meta = {
  title: "Single date",
}

export default function Demo() {
  const [date, setDate] = React.useState<Date | undefined>(() => new Date())
  return <Calendar mode="single" selected={date} onSelect={setDate} />
}
