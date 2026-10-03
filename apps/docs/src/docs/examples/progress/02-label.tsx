import * as React from "react"

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/m3e/progress"

export const meta = {
  title: "With a label and a moving value",
  layout: "block",
}

export default function Demo() {
  const [value, setValue] = React.useState(10)
  React.useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 10)), 700)
    return () => clearInterval(id)
  }, [])
  return (
    <Progress value={value} className="max-w-md">
      <ProgressLabel>Uploading</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}
