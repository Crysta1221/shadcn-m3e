import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"

import "./index.css"
import { routeTree } from "./routeTree.gen"
import { M3eProvider } from "@/components/m3e/m3e-provider"
import { TooltipProvider } from "@/components/m3e/tooltip"
import { Toaster } from "@/components/m3e/sonner"

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <M3eProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
        {/* the docs show a navigation bar (80px) under md; keep the snackbar above it */}
        <Toaster className="max-md:[--snackbar-offset:5rem]" />
      </TooltipProvider>
    </M3eProvider>
  </StrictMode>
)
