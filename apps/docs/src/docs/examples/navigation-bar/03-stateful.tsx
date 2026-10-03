import * as React from "react"

import { NavigationBar, NavigationBarItem } from "@/components/m3e/navigation"

export const meta = {
  title: "With state",
  layout: "block",
}

export default function Demo() {
  const [tab, setTab] = React.useState("home")
  const items = [
    ["home", "Home"],
    ["explore", "Explore"],
    ["library_music", "Library"],
  ]
  return (
    <div className="max-w-md overflow-hidden rounded-lg border border-outline-variant">
      <NavigationBar>
        {items.map(([icon, label]) => (
          <NavigationBarItem
            key={icon}
            icon={icon}
            label={label}
            active={tab === icon}
            onClick={() => setTab(icon)}
          />
        ))}
      </NavigationBar>
    </div>
  )
}
