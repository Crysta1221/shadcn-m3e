import * as React from "react"
import { Outlet } from "@tanstack/react-router"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/m3e/sheet"

/**
 * Layout of a documentation section: an expanded navigation rail on wide
 * windows, the same rail in a sheet on narrow ones.
 */
function DocsShell({
  title,
  nav,
}: {
  title: string
  nav: (onNavigate?: () => void) => React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex">
      <aside className="sticky top-16 hidden h-[calc(100svh-4rem)] shrink-0 bg-surface-container lg:block">
        {nav()}
      </aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-16 z-30 flex h-14 items-center gap-2 bg-surface-container/90 px-2 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="text"
                  size="icon"
                  aria-label={`Browse ${title.toLowerCase()}`}
                  className="text-on-surface-variant"
                />
              }
            >
              <Icon name="menu" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 data-[side=left]:w-80 data-[side=left]:max-w-[85vw] data-[side=left]:sm:max-w-80"
            >
              <SheetTitle className="sr-only">{title}</SheetTitle>
              {/* the rail fills the sheet, and starts below the close button */}
              <div className="h-full overflow-hidden [&_nav]:w-full [&_nav]:pt-16">
                {nav(() => setOpen(false))}
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-title-medium text-on-surface">{title}</span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export { DocsShell }
