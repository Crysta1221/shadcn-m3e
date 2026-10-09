import type * as React from "react"

import { cn } from "@/lib/m3e/cn"

import { CHANGELOG } from "./content"
import {
  CHANGELOG_INTRO,
  formatDate,
  newestFirst,
  prUrl,
  typeLabel,
  userUrl,
} from "./changelog-format"
import { Markdown } from "./markdown"

// feat and fix have their own role colors; any other type is neutral
const TAG: Record<string, string> = {
  feat: "bg-primary-container text-on-primary-container",
  fix: "bg-tertiary-container text-on-tertiary-container",
}

function GitHubLink({ href, children }: React.ComponentProps<"a">) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
    >
      {children}
    </a>
  )
}

/** The Changelog page: each entry's date, its title and its items with a type tag. */
function Changelog() {
  return (
    <>
      <Markdown source={`# Changelog\n\n${CHANGELOG_INTRO}`} />
      {newestFirst(CHANGELOG).map((day) => {
        const { title, items } = CHANGELOG[day]
        return (
          <section key={day} className="flex flex-col gap-4">
            <Markdown
              source={`## ${formatDate(day)}${title ? `\n\n**${title}**` : ""}`}
            />
            <ul className="flex flex-col gap-3">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-6 w-20 shrink-0 items-center justify-center rounded-full px-3 text-label-medium",
                      TAG[item.type] ??
                        "bg-secondary-container text-on-secondary-container"
                    )}
                  >
                    {typeLabel(item.type)}
                  </span>
                  <span className="text-body-large text-on-surface-variant">
                    {item.text}
                    {item.by && (
                      <>
                        {" by "}
                        <GitHubLink href={userUrl(item.by)}>
                          @{item.by}
                        </GitHubLink>
                      </>
                    )}
                    {item.pr && (
                      <>
                        {" ("}
                        <GitHubLink href={prUrl(item.pr)}>
                          #{item.pr}
                        </GitHubLink>
                        {")"}
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </>
  )
}

export { Changelog }
