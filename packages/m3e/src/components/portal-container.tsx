"use client"

import * as React from "react"

// undefined: no container, overlays go to the page; null: the container is not
// there yet (its element is still being created), overlays wait for it
const PortalContainerContext = React.createContext<
  HTMLElement | null | undefined
>(undefined)

/**
 * Where the overlays below it (dialogs, sheets, menus, popovers, tooltips…) are
 * rendered instead of the end of the page: a preview, an embedded demo, a canvas.
 * Give the element `position: relative` and a `transform` so `fixed` overlays
 * are laid out inside it too.
 */
function PortalContainer({
  container,
  children,
}: {
  container: HTMLElement | null
  children?: React.ReactNode
}) {
  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  )
}

/** the element overlays render into, or undefined for the page itself */
function usePortalContainer() {
  return React.useContext(PortalContainerContext)
}

export { PortalContainer, usePortalContainer }
