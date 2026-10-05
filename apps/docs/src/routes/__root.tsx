import {
  Link,
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import {
  NavigationBar,
  NavigationBarItem,
  NavigationRail,
  NavigationRailHeader,
  NavigationRailItem,
} from "@/components/m3e/navigation"
import { useColorMode } from "@/components/m3e/color-mode-provider"
import { usePageMeta } from "@/docs/use-page-meta"
import { DocsSearch } from "@/docs/search"

const NAV = [
  { to: "/", icon: "home", label: "Home" },
  { to: "/docs", icon: "menu_book", label: "Docs" },
  { to: "/components", icon: "widgets", label: "Components" },
  { to: "/examples", icon: "dashboard", label: "Examples" },
  { to: "/playground", icon: "draw", label: "Playground" },
  { to: "/theme", icon: "palette", label: "Theme" },
] as const

/** a navigation bar holds at most five destinations: Home is the logo in the header there */
const BAR_NAV = NAV.filter((n) => n.to !== "/")

function ColorModeToggle() {
  const { resolvedMode, toggleMode } = useColorMode()
  const dark = resolvedMode === "dark"
  return (
    <Button
      variant="text"
      size="icon"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="text-on-surface-variant max-md:size-12"
      onClick={toggleMode}
    >
      <Icon name={dark ? "light_mode" : "dark_mode"} />
    </Button>
  )
}

/** Sticky top bar: the docs search and the color mode toggle. */
function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 bg-surface-container px-3">
      <div className="flex min-w-12 flex-1 items-center">
        <Link to="/" aria-label="Home" className="md:hidden">
          <img src="/favicon.svg" alt="" className="size-8" />
        </Link>
      </div>
      <div className="relative h-11 w-full max-w-md min-w-0 shrink">
        <DocsSearch />
      </div>
      <div className="flex min-w-12 flex-1 items-center justify-end">
        <ColorModeToggle />
      </div>
    </header>
  )
}

function Root() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const active = (to: string) =>
    to === "/" ? path === "/" : path.startsWith(to)
  usePageMeta(path)

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <div className="sticky top-0 hidden h-svh shrink-0 md:block">
        <NavigationRail className="bg-surface-container">
          <NavigationRailHeader>
            <img src="/favicon.svg" alt="shadcn M3E" className="size-10" />
          </NavigationRailHeader>
          {NAV.map((n) => (
            <NavigationRailItem
              key={n.to}
              icon={n.icon}
              label={n.label}
              active={active(n.to)}
              render={<Link to={n.to} />}
            />
          ))}
        </NavigationRail>
      </div>

      <main className="min-w-0 flex-1 pb-20 md:pb-0">
        <SiteHeader />
        <Outlet />
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <NavigationBar elevated>
          {BAR_NAV.map((n) => (
            <NavigationBarItem
              key={n.to}
              icon={n.icon}
              label={n.label}
              active={active(n.to)}
              render={<Link to={n.to} />}
            />
          ))}
        </NavigationBar>
      </div>
    </div>
  )
}

export const Route = createRootRoute({ component: Root })
