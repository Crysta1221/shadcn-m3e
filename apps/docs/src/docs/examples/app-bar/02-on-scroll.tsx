import * as React from "react"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { AppBar, useScrolled } from "@/components/m3e/app-bar"

export const meta = {
  title: "Color change on scroll",
  description: "Scroll the list: the bar turns surface-container.",
  layout: "block",
}

export default function Demo() {
  const list = React.useRef<HTMLDivElement>(null)
  const scrolled = useScrolled(list)
  return (
    <div className="flex h-72 max-w-lg flex-col overflow-hidden rounded-lg border border-outline-variant">
      <AppBar
        title="Scroll me"
        scrolled={scrolled}
        leading={
          <Button variant="text" size="icon" aria-label="Menu">
            <Icon name="menu" />
          </Button>
        }
      />
      <div ref={list} className="flex-1 overflow-y-auto p-4 text-on-surface">
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className="py-2">
            Row {i + 1}
          </p>
        ))}
      </div>
    </div>
  )
}
