import * as React from "react"

import { cn } from "@/lib/m3e/cn"

type Heading = { level: 2 | 3; text: string; id: string }

/** the id of the last heading that has scrolled past the top of the page */
function useActiveHeading(ids: string[]) {
  const [active, setActive] = React.useState<string | null>(ids[0] ?? null)
  const key = ids.join("\0")

  React.useEffect(() => {
    const list = key ? key.split("\0") : []
    let frame = 0
    const update = () => {
      frame = 0
      // just below the sticky mobile header
      const line = 96
      let current = list[0] ?? null
      for (const id of list) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= line) current = id
        else break
      }
      // the bottom of the page can't scroll the last headings to the line
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (atEnd && list.length) current = list[list.length - 1]
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [key])

  return active
}

/** "On this page": the headings of a guide, with the section being read marked */
function Toc({ headings }: { headings: Heading[] }) {
  const active = useActiveHeading(headings.map((h) => h.id))

  return (
    <nav aria-label="On this page">
      <p className="mb-2 text-label-large text-on-surface">On this page</p>
      <ul className="flex flex-col border-l border-outline-variant text-body-small">
        {headings.map((h) => {
          const current = h.id === active
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1 transition-colors motion-effects-fast",
                  h.level === 3 ? "pl-6" : "pl-3",
                  current
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                )}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export { Toc }
