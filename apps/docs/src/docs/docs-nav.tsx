import { Link, useRouterState } from "@tanstack/react-router"

import { ScrollArea } from "@/components/m3e/scroll-area"
import {
  NavigationRail,
  NavigationRailItem,
  NavigationRailSection,
} from "@/components/m3e/navigation"

import { OUTLINE } from "./outline"

/** The guide, as an expanded navigation rail with a section per group. */
function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const current = decodeURIComponent(path.split("/")[2] ?? "")

  return (
    <ScrollArea className="h-full">
      <NavigationRail
        expanded
        compact
        aria-label="Documentation"
        className="h-auto w-72 overflow-visible bg-transparent pt-4"
      >
        {OUTLINE.map((section) => (
          <div key={section.title} className="contents">
            <NavigationRailSection>{section.title}</NavigationRailSection>
            {section.pages.map((p) => (
              <NavigationRailItem
                key={p.slug}
                icon={p.icon}
                label={p.title}
                active={current === p.slug}
                render={
                  <Link
                    to="/docs/$slug"
                    params={{ slug: p.slug }}
                    onClick={onNavigate}
                  />
                }
              />
            ))}
          </div>
        ))}
      </NavigationRail>
    </ScrollArea>
  )
}

export { DocsNav }
