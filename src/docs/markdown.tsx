import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  Markdown as TanStackMarkdown,
  type MarkdownComponents,
} from "@tanstack/markdown/react"

import { Icon } from "@/components/m3e/icon"
import { ScrollArea } from "@/components/m3e/scroll-area"

import { CodeBlock } from "./code-block"
import { CommandBlock } from "./command-block"
import type { CodeLang } from "./highlighter"
import { slugify } from "./markdown-utils"
import { SITE_ORIGIN } from "./site"

const LANGS = new Set<string>(["tsx", "css", "bash", "json", "text"])
const ALIAS: Record<string, CodeLang> = {
  ts: "tsx",
  typescript: "tsx",
  jsx: "tsx",
  js: "tsx",
  html: "tsx",
  sh: "bash",
  shell: "bash",
}

const isCodeLang = (v: string): v is CodeLang => LANGS.has(v)

const textOf = (node: React.ReactNode): string =>
  React.Children.toArray(node)
    .map((c) =>
      typeof c === "string" || typeof c === "number"
        ? String(c)
        : React.isValidElement<{ children?: React.ReactNode }>(c)
          ? textOf(c.props.children)
          : ""
    )
    .join("")

function heading(level: 1 | 2 | 3 | 4, className: string) {
  const Tag = `h${level}` as const
  return function Heading({ children }: { children?: React.ReactNode }) {
    const id = slugify(textOf(children))
    return (
      <Tag id={id} className={`${className} group scroll-mt-20`}>
        {children}
        {level > 1 && (
          <a
            href={`#${id}`}
            aria-label="Link to this section"
            className="ml-2 align-middle text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Icon name="link" size={18} />
          </a>
        )}
      </Tag>
    )
  }
}

const components: MarkdownComponents = {
  h1: heading(1, "text-display-small-emphasized text-on-surface"),
  h2: heading(2, "mt-6 text-headline-small text-on-surface"),
  h3: heading(3, "mt-2 text-title-large text-on-surface"),
  h4: heading(4, "text-title-medium text-on-surface"),
  p: ({ children }) => (
    <p className="text-body-large text-on-surface-variant">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="flex list-disc flex-col gap-2 pl-6 text-body-large text-on-surface-variant">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="flex list-decimal flex-col gap-2 pl-6 text-body-large text-on-surface-variant">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-on-surface">{children}</strong>
  ),
  hr: () => <hr className="border-outline-variant" />,
  blockquote: ({ children }) => (
    <blockquote className="flex flex-col gap-2 rounded-md bg-secondary-container px-4 py-3 text-on-secondary-container [&_p]:text-inherit">
      {children}
    </blockquote>
  ),
  a: ({ href = "", children }) => {
    const cls =
      "text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
    if (href.startsWith("/") && !href.startsWith("//"))
      return (
        <Link to={href} className={cls}>
          {children}
        </Link>
      )
    const external = /^https?:/.test(href)
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    )
  },
  pre: ({ children }) => {
    const child = React.Children.only(children)
    if (
      !React.isValidElement<{
        className?: string
        children?: React.ReactNode
      }>(child)
    )
      return <pre>{children}</pre>
    const raw =
      /language-(\w+)/.exec(child.props.className ?? "")?.[1] ?? "text"
    const lang: CodeLang = isCodeLang(raw) ? raw : (ALIAS[raw] ?? "text")
    const code = textOf(child.props.children)
    // `npx …` commands get a package-manager switch
    const lines = code.split("\n").filter(Boolean)
    if (
      lang === "bash" &&
      lines.length &&
      lines.every((l) => l.startsWith("npx "))
    )
      return <CommandBlock command={code.trim()} />
    return <CodeBlock code={code} lang={lang} />
  },
  // block code is handled by `pre`; this is the inline chip
  code: ({ children, className }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code>{children}</code>
    ),
  table: ({ children }) => (
    <ScrollArea
      scrollbars="horizontal"
      className="rounded-md border border-outline-variant"
    >
      <table className="w-full min-w-max border-collapse text-left text-body-medium">
        {children}
      </table>
    </ScrollArea>
  ),
  thead: ({ children }) => (
    <thead className="bg-surface-container text-label-large text-on-surface">
      {children}
    </thead>
  ),
  th: ({ children }) => <th className="px-4 py-2 font-medium">{children}</th>,
  td: ({ children }) => (
    <td className="border-t border-outline-variant px-4 py-2 align-top text-on-surface-variant">
      {children}
    </td>
  ),
}

/** Renders a guide page. Fenced code goes through the TanStack Highlight `CodeBlock`. */
function Markdown({ source }: { source: string }) {
  // {{origin}} is the hosted site: the registry lives there
  const text = source.replaceAll("{{origin}}", SITE_ORIGIN)
  return (
    <div className="flex flex-col gap-4">
      <TanStackMarkdown components={components}>{text}</TanStackMarkdown>
    </div>
  )
}

export { Markdown }
