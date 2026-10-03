import { Link, useRouterState } from "@tanstack/react-router"

import { ScrollArea } from "@/components/m3e/scroll-area"
import {
  NavigationRail,
  NavigationRailItem,
  NavigationRailSection,
} from "@/components/m3e/navigation"

import { CATEGORIES, DOCS } from "./registry"

/**
 * The component list, as an expanded navigation rail (M3E) with a section per
 * category.
 */
function ComponentsNav({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const current = decodeURIComponent(path.split("/")[2] ?? "")

  return (
    <ScrollArea className="h-full">
      <NavigationRail
        expanded
        compact
        aria-label="Components"
        className="h-auto w-72 overflow-visible bg-transparent pt-4"
      >
        <NavigationRailItem
          icon="apps"
          label="Overview"
          active={path === "/components" || path === "/components/"}
          render={<Link to="/components" onClick={onNavigate} />}
        />
        {CATEGORIES.map((category) => {
          const items = DOCS.filter((d) => d.category === category)
          if (!items.length) return null
          return (
            <div key={category} className="contents">
              <NavigationRailSection>{category}</NavigationRailSection>
              {items.map((d) => (
                <NavigationRailItem
                  key={d.slug}
                  icon={d.icon}
                  label={d.name}
                  active={current === d.slug}
                  render={
                    <Link
                      to="/components/$slug"
                      params={{ slug: d.slug }}
                      onClick={onNavigate}
                    />
                  }
                />
              ))}
            </div>
          )
        })}
      </NavigationRail>
    </ScrollArea>
  )
}

export { ComponentsNav }
