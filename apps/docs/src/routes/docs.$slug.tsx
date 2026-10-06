import { Link, createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { Changelog } from "@/docs/changelog"
import { CONTENT } from "@/docs/content"
import { Markdown } from "@/docs/markdown"
import { NotFound } from "@/docs/not-found"
import { headingsOf } from "@/docs/markdown-utils"
import { Toc } from "@/docs/toc"
import { GUIDE_PAGES, OUTLINE } from "@/docs/outline"

export const Route = createFileRoute("/docs/$slug")({
  component: DocPage,
})

function DocPage() {
  const { slug } = Route.useParams()
  const at = GUIDE_PAGES.findIndex((p) => p.slug === slug)
  const page = GUIDE_PAGES[at]
  const source = CONTENT[slug]

  if (!page || source === undefined) {
    return (
      <NotFound title={`No page called “${slug}”`}>
        Pick one from the docs navigation.
      </NotFound>
    )
  }

  const section = OUTLINE.find((s) => s.pages.includes(page))
  const toc = headingsOf(source)
  const prev = GUIDE_PAGES[at - 1]
  const next = GUIDE_PAGES[at + 1]

  return (
    <div className="mx-auto flex max-w-5xl gap-10 p-6 py-10">
      <article className="flex max-w-3xl min-w-0 flex-1 flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-label-large text-on-surface-variant">
            <Link to="/docs" className="hover:underline">
              Docs
            </Link>
            <Icon name="chevron_right" size={18} />
            <span>{section?.title}</span>
          </div>
          {slug === "changelog" ? <Changelog /> : <Markdown source={source} />}
        </div>

        <nav
          aria-label="Previous and next page"
          className="flex justify-between gap-3 border-t border-outline-variant pt-6"
        >
          {prev ? (
            <Button
              variant="outlined"
              render={<Link to="/docs/$slug" params={{ slug: prev.slug }} />}
              nativeButton={false}
            >
              <Icon name="arrow_back" size={20} />
              {prev.title}
            </Button>
          ) : (
            <span />
          )}
          {next && (
            <Button
              variant="outlined"
              render={<Link to="/docs/$slug" params={{ slug: next.slug }} />}
              nativeButton={false}
            >
              {next.title}
              <Icon name="arrow_forward" size={20} />
            </Button>
          )}
        </nav>
      </article>

      {toc.length > 1 && (
        <aside className="sticky top-24 hidden h-fit w-52 shrink-0 xl:block">
          <Toc headings={toc} />
        </aside>
      )}
    </div>
  )
}
