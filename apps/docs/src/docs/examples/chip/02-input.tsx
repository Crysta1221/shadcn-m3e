import * as React from "react"

import { InputChip } from "@/components/m3e/chip"

export const meta = {
  title: "Input chips",
  description: "Remove a chip with its close button.",
}

export default function Demo() {
  const [tags, setTags] = React.useState(["Kyoto", "Osaka", "Nara"])
  return (
    <>
      {tags.map((t) => (
        <InputChip
          key={t}
          icon="location_on"
          onRemove={() => setTags((all) => all.filter((x) => x !== t))}
        >
          {t}
        </InputChip>
      ))}
    </>
  )
}
