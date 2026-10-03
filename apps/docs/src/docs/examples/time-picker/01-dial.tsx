import { TimePicker } from "@/components/m3e/time-picker"

export const meta = {
  title: "12-hour and 24-hour",
  description:
    "Choose the hour, then the minutes. The keyboard icon switches to typing.",
}

export default function Demo() {
  return (
    <>
      <TimePicker onCancel={() => {}} onConfirm={() => {}} />
      <TimePicker hour24 defaultValue={{ hours: 15, minutes: 45 }} />
    </>
  )
}
