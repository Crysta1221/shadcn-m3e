import * as React from "react"

import { Icon } from "@/components/m3e/icon"
import { ExtendedFab } from "@/components/m3e/fab"

export const meta = {
  title: "Extended",
  description: "Click to collapse it to an icon-only FAB.",
}

export default function Demo() {
  const [collapsed, setCollapsed] = React.useState(false)
  return (
    <ExtendedFab
      icon={<Icon name="edit" />}
      collapsed={collapsed}
      onClick={() => setCollapsed((v) => !v)}
    >
      Compose
    </ExtendedFab>
  )
}
