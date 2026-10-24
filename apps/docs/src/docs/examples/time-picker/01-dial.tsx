import { TimePicker } from "@/components/m3e/time-picker"

export const meta = {
  title: "12-hour and 24-hour",
  description:
    "Choose the hour, then the minutes. The keyboard icon switches to typing.",
}

export default function Demo() {
  return (
    <>
      <TimePicker className="p-2" onCancel={() => {}} onConfirm={() => {}} />
      <TimePicker
        className="p-2"
        hour24
        defaultValue={{ hours: 15, minutes: 45 }}
      />
    </>
  )
}
