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
import { NotFound } from "@/docs/not-found"
import { usePageMeta } from "@/docs/use-page-meta"
import {
  DocsSearchBar,
  DocsSearchButton,
  DocsSearchProvider,
} from "@/docs/search"

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

const REPO_URL = "https://github.com/Crysta1221/shadcn-m3e"

/** The repository, beside the color-mode toggle. */
function GitHubLink() {
  return (
    <Button
      variant="text"
      size="icon"
      aria-label="GitHub"
      title="GitHub"
      className="text-on-surface-variant max-md:size-12"
      nativeButton={false}
      render={
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        />
      }
    >
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
    </Button>
  )
}

/** Sticky top bar: the docs search, the color mode toggle and the repository. */
function SiteHeader() {
  return (
    <DocsSearchProvider>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-2 bg-surface-container px-3">
        <div className="flex min-w-0 flex-1 items-center">
          <Link to="/" aria-label="Home" className="md:hidden">
            <img src="/favicon.svg" alt="" className="size-8" />
          </Link>
        </div>
        <DocsSearchBar className="relative hidden h-11 w-full max-w-md min-w-0 shrink md:block" />
        <div className="flex flex-1 items-center justify-end">
          <DocsSearchButton />
          <ColorModeToggle />
          <GitHubLink />
        </div>
      </header>
    </DocsSearchProvider>
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

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: () => <NotFound />,
})
